import { UpdateUserDto, UserDto } from './users.dto';
import * as fs from 'fs-extra';
import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { authenticator } from 'otplib';
import { ConfigService } from '../config/config.service';
import { Logger } from '../logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.checkAuthFile();
  }

  /**
   * Returns all the users
   * @param strip if true, remove the users salt and hashed password from the response
   */
  async get(strip?: boolean): Promise<UserDto[]> {
    const users: UserDto[] = await fs.readJson(this.configService.authPath);

    if (strip) {
      return users.map(this.desensitiseUserProfile);
    }

    return users;
  }
  /**
   * Return a user by it's id
   * @param id
   */
  async findById(id: number): Promise<UserDto> {
    const users = await this.get();
    const user = users.find((x) => x.id === id);
    return user;
  }
  /**
   * Return a user by it's username
   * @param username
   */
  async findByUsername(username: string): Promise<UserDto> {
    const users = await this.get();
    const user = users.find((x) => x.username === username);
    return user;
  }

  /**
   * Add a new user
   * @param user
   */
  async create(user) {
    const authfile = await this.get();

    // user object
    const newUser: UserDto = {
      id: authfile.length ? Math.max(...authfile.map((x) => x.id)) + 1 : 1,
      username: user.username,
      hashedPassword: user.hashedPassword,
      admin: user.admin,
    };

    // check a user with the same username does not already exist
    if (
      authfile.find(
        (x) => x.username.toLowerCase() === newUser.username.toLowerCase(),
      )
    ) {
      throw new ConflictException(
        `User with username '${newUser.username}' already exists.`,
      );
    }

    // add the user to the authfile
    authfile.push(newUser);

    // update the auth.json
    await this.saveUserFile(authfile);
    this.logger.warn(`Added new user: ${user.username}`);

    return this.desensitiseUserProfile(newUser);
  }

  /**
   * Updates a user
   * @param userId
   * @param update
   */
  async update(id: number, update: UpdateUserDto) {
    const authfile = await this.get();
    const user = authfile.find((x) => x.id === id);

    if (!user) {
      throw new BadRequestException('User Not Found');
    }

    if (update.username && user.username !== update.username) {
      if (
        authfile.find(
          (x) => x.username.toLowerCase() === update.username.toLowerCase(),
        )
      ) {
        throw new ConflictException(
          `User with username '${update.username}' already exists.`,
        );
      }

      this.logger.log(
        `Updated user: Changed username from '${user.username}' to '${update.username}'`,
      );
      user.username = update.username;
    }

    user.admin = update.admin === undefined ? user.admin : update.admin;

    user.hashedPassword =
      update.hashedPassword === undefined
        ? user.hashedPassword
        : update.hashedPassword;
    user.refreshToken =
      update.refreshToken === undefined
        ? user.refreshToken
        : update.refreshToken;

    // update the auth.json
    this.saveUserFile(authfile);
    this.logger.log(`Updated user: ${user.username}: ${Object.keys(update)}`);

    return this.desensitiseUserProfile(user);
  }

  /**
   * Remove a user
   * @param id
   */
  async delete(id: number) {
    const authfile = await this.get();

    const index = authfile.findIndex((x) => x.id === id);

    if (index < 0) {
      throw new BadRequestException('User Not Found');
    }

    // prevent deleting the only admin user
    if (
      authfile[index].admin &&
      authfile.filter((x) => x.admin === true).length < 2
    ) {
      throw new BadRequestException('Cannot delete only admin user');
    }

    authfile.splice(index, 1);

    // update the auth.json
    await this.saveUserFile(authfile);
    this.logger.warn(`Deleted user with ID ${id}`);
  }

  /**
   * Setup OTP
   * @param username
   */
  async setupOtp(username: string) {
    const authfile = await this.get();
    const user = authfile.find((x) => x.username === username);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.otpActive) {
      throw new ForbiddenException('2FA has already been activated.');
    }

    user.otpSecret = authenticator.generateSecret();

    await this.saveUserFile(authfile);
    const appName = `Yacht (${this.configService.instanceId.slice(0, 7)})`;

    return {
      timestamp: new Date(),
      otpauth: authenticator.keyuri(user.username, appName, user.otpSecret),
    };
  }

  /**
   * Activates the OTP requirement for a user after verifying the otp code
   * @param username
   * @param code
   */
  async activateOtp(username: string, code: string) {
    const authfile = await this.get();
    const user = authfile.find((x) => x.username === username);

    if (authenticator.verify({ token: code, secret: user.otpSecret })) {
      user.otpActive = true;
      await this.saveUserFile(authfile);
      this.logger.warn(`Activated 2FA for '${user.username}'.`);
      return this.desensitiseUserProfile(user);
    } else {
      throw new BadRequestException('2FA code is not valid.');
    }
  }

  async deactivateOtp(username: string, password: string) {
    const authfile = await this.get();
    const user = authfile.find((x) => x.username === username);
    user.otpActive = false;
    delete user.otpSecret;
    await this.saveUserFile(authfile);
    this.logger.warn(`Deactivated 2FA for '${username}'.`);
    return this.desensitiseUserProfile(user);
  }

  /**
   * Clean the user profile of se
   */
  desensitiseUserProfile(user: UserDto): UserDto {
    return {
      id: user.id,
      username: user.username,
      admin: user.admin,
      refreshToken: user.refreshToken,
      otpActive: user.otpActive || false,
    };
  }

  /**
   * Executed on startup to see if the auth file is setup yet
   */
  async checkAuthFile() {
    if (!(await fs.pathExists(this.configService.authPath))) {
      this.configService.setupWizardComplete = false;
      return;
    }
    try {
      const authfile: UserDto[] = await fs.readJson(
        this.configService.authPath,
      );
      // there must be at least one admin user
      if (!authfile.find((x) => x.admin === true)) {
        this.configService.setupWizardComplete = false;
      }
    } catch (e) {
      this.configService.setupWizardComplete = false;
    }
  }
  /**
   * Saves the user file
   * @param users
   */
  private async saveUserFile(users: UserDto[]) {
    // update the auth.json
    return await fs.writeJson(this.configService.authPath, users, {
      spaces: 4,
    });
  }
}
