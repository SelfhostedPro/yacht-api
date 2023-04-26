import * as fs from 'fs-extra';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { authenticator } from 'otplib';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as NodeCache from 'node-cache';
import { ConfigService } from '../config/config.service';
import { Logger } from '../logger/logger.service';
import { UserDto } from '../users/users.dto';
import { UsersService } from 'src/users/users.service';
import { TokensDto, UserTokensDto } from './auth.dto';

@Injectable()
export class AuthService {
  private otpUsageCache = new NodeCache({ stdTTL: 90 });

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {
    // otp options
    authenticator.options = {
      window: 1,
    };
  }

  /**
   * Authenticate a user with their credentials
   * @param username
   * @param password
   */
  async authenticate(
    username: string,
    password: string,
    otp?: string,
  ): Promise<any> {
    try {
      const user: UserDto = await this.usersService.findByUsername(username);
      if (!user) {
        throw new ForbiddenException();
      }
      await this.checkPassword(user, password);
      if (user.otpActive && !otp) {
        throw new HttpException('2FA Code Required', 412);
      }

      if (user.otpActive && !this.verifyOtpToken(user, otp)) {
        throw new HttpException('2FA Code Invalid', 412);
      }

      if (user) {
        return {
          id: user.id,
          username: user.username,
          admin: user.admin,
          instanceId: this.configService.instanceId,
        };
      }
    } catch (e) {
      if (e instanceof ForbiddenException) {
        this.logger.warn('Failed login attempt');
        this.logger.warn(
          "If you've forgotten your password you can reset to the default " +
          `of admin/admin by deleting the "auth.json" file (${this.configService.authPath}) and then restarting Yacht.`,
        );
        throw e;
      }

      if (e instanceof HttpException) {
        throw e;
      }

      throw new ForbiddenException();
    }
  }

  /**
   * Authenticate and provide a JWT response
   * @param username
   * @param password
   */
  async signIn(username: string, password: string, otp?: string): Promise<UserTokensDto> {
    const user = await this.authenticate(username, password, otp);
    const tokens: TokensDto = await this.getTokens(user.id, user.username, user.admin);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { username: user.username, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  /**
   * Logout user and remove refresh token
   */
  async logout(id: number) {
    await this.usersService.update(id, { refreshToken: null })
    return 'ok'
  }

  /**
   * Add new user
   * @param user
   */
  async addUser(user): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findByUsername(
      user.username
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    // Hash password
    const hash = await this.hashData(user.password);
    const newUser = await this.usersService.create({
      ...user,
      password: hash,
    });
    const tokens = await this.getTokens(newUser.id, newUser.username, newUser.admin);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  /**
   * Validate the current refresh token and generate a new one.
   * @param id
   * @param refreshToken
   */

  async refreshTokens(id: number, refreshToken: string) {
    const user = await this.usersService.findById(id);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.username, user.admin);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
  /**
   * Give user a new refresh token in our auth file
   * @param userId 
   * @param refreshToken 
   */
  async updateRefreshToken(id: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(id, {
      refreshToken: hashedRefreshToken,
    });
  }

  /**
   * Verify as users username and password
   * This will throw an error if the credentials are incorrect.
   */
  private async checkPassword(user: UserDto, loginPassword: string) {
    const passwordMatches = await argon2.verify(user.hashedPassword, loginPassword);

    if (passwordMatches) {
      return user;
    } else {
      throw new ForbiddenException();
    }
  }

  /**
   * Generates access token and refresh token
   * @param userId
   * @param username
   */
  async getTokens(userId: number, username: string, admin: boolean) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          admin: admin,
        },
        {
          secret: this.configService.secrets.accessSecret,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          admin: admin,
        },
        {
          secret: this.configService.secrets.refreshSecret,
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  storeTokensInCookies(res: Response, tokens: TokensDto) {
    res.cookie('access-token', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15
    })
    res.cookie('refresh-token', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7
    })
  }

  /**
   * Returns a token for use when authentication is disabled
   */
  async generateNoAuthToken() {
    // prevent access if auth is not disabled
    if (this.configService.ui.auth !== 'none') {
      throw new UnauthorizedException();
    }

    // load the first admin we can find
    const users = await this.usersService.get();
    const user = users.find((x) => x.admin === true);

    // generate a token
    const token = await this.jwtService.sign({
      username: user.username,
      admin: user.admin,
      instanceId: this.configService.instanceId,
    });

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: this.configService.ui.sessionTimeout,
    };
  }

  /**
   * Validate User
   * All information about the user we need is stored in the payload
   * @param payload the decoded, verified jwt payload
   */
  async validateUser(payload): Promise<any> {
    return payload;
  }

  /**
   * Verify a token is signed correctly
   * @param token
   */
  async verifyWsConnection(client) {
    try {
      return jwt.verify(
        client.handshake.query.token,
        this.configService.secrets.accessSecret,
      );
    } catch (e) {
      client.disconnect();
      throw new WsException('Unauthorized');
    }
  }


  /**
   * Setup the first user
   */
  async setupFirstUser(user: UserDto) {
    if (this.configService.setupWizardComplete) {
      throw new ForbiddenException();
    }

    if (!user.password) {
      throw new BadRequestException('Password missing.');
    }

    // first user must be admin
    user.admin = true;

    user.hashedPassword = await this.hashData(user.password)

    await fs.writeJson(this.configService.authPath, []);

    const createdUser = await this.usersService.create(user);

    this.configService.setupWizardComplete = true;

    return createdUser;
  }

  /**
   * Generates a token for the setup wizard
   */
  async generateSetupWizardToken() {
    // prevent access if auth is not disabled
    if (this.configService.setupWizardComplete !== false) {
      throw new ForbiddenException();
    }

    // generate a token
    const token = await this.jwtService.sign(
      {
        username: 'setup-wizard',
        name: 'setup-wizard',
        admin: true,
        instanceId: 'xxxxx', // intentionally wrong
      },
      { expiresIn: '5m' },
    );

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 300,
    };
  }



  /**
   * Change a users own password
   */
  async updateOwnPassword(
    username: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const authfile = await this.usersService.get();
    const user = authfile.find((x) => x.username === username);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // this will throw an error of the password is wrong
    await this.checkPassword(user, currentPassword);

    // generate a new salf
    const hashedPassword = await this.hashData(newPassword);

    return await this.usersService.update(user.id, {
      hashedPassword: hashedPassword
    })
  }

  /**
   * Generate an OTP secret for a user
   */
  async setupOtp(username: string) {
    return this.usersService.setupOtp(username)
  }

  /**
   * Activates the OTP requirement for a user after verifying the otp code
   */
  async activateOtp(username: string, code: string) {
    const authfile = await this.usersService.get();
    const user = authfile.find((x) => x.username === username);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!user.otpSecret) {
      throw new BadRequestException('2FA has not been setup.');
    }
    return await this.usersService.activateOtp(username, code)
  }

  /**
   * Deactivates the OTP requirement for a user after verifying their password
   */
  async deactivateOtp(username: string, password: string) {
    const authfile = await this.usersService.get();
    const user = authfile.find((x) => x.username === username);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // this will throw an error if the password is not valid
    await this.checkPassword(user, password);

    return this.usersService.deactivateOtp(username, password);
  }

  /**
   * Verify an OTP token for a user and prevent it being used more than once
   */
  verifyOtpToken(user: UserDto, otp: string): boolean {
    const otpCacheKey = user.username + otp;

    if (this.otpUsageCache.get(otpCacheKey)) {
      this.logger.warn(
        `[${user.username}] attempted to reuse one-time-password.`,
      );
      return false;
    }

    if (authenticator.verify({ token: otp, secret: user.otpSecret })) {
      this.otpUsageCache.set(otpCacheKey, 'true');
      return true;
    }

    return false;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }
}
