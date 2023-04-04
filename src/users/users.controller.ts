import { Controller, UseGuards, Body, Post, Get, Param, Delete, Patch, ParseIntPipe, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserDto, UserUpdatePasswordDto, UserActivateOtpDto, UserDeactivateOtpDto } from './users.dto';

@ApiTags('User Management')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {

  constructor(
    private authService: AuthService,
  ) { }

  @UseGuards(AdminGuard)
  @ApiResponse({ type: UserDto, isArray: true, status: 200 })
  @ApiOperation({ summary: 'List of existing users.' })
  @Get()
  getUsers() {
    return this.authService.getUsers(true);
  }

  @UseGuards(AdminGuard)
  @ApiResponse({ type: UserDto, status: 201 })
  @ApiOperation({ summary: 'Create a new user.' })
  @Post()
  addUser(@Body() body: UserDto) {
    return this.authService.addUser(body);
  }

  @UseGuards(AdminGuard)
  @ApiResponse({ type: UserDto, status: 200 })
  @ApiOperation({ summary: 'Update a user.' })
  @ApiParam({ name: 'userId', type: 'number' })
  @Patch('/:userId(\\d+)')
  updateUser(@Param('userId', ParseIntPipe) userId: number, @Body() body: UserDto) {
    return this.authService.updateUser(userId, body);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a user.' })
  @ApiParam({ name: 'userId', type: 'number' })
  @Delete('/:userId(\\d+)')
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.authService.deleteUser(userId);
  }

  @ApiOperation({ summary: 'Update the password for the current user.' })
  @ApiBody({ type: UserUpdatePasswordDto })
  @Post('/change-password')
  updateOwnPassword(@Req() req, @Body() body: UserUpdatePasswordDto) {
    return this.authService.updateOwnPassword(req.user.username, body.currentPassword, body.newPassword);
  }

  @ApiOperation({ summary: 'Start 2FA setup for the current user.' })
  @Post('/otp/setup')
  setupOtp(@Req() req) {
    return this.authService.setupOtp(req.user.username);
  }

  @ApiOperation({ summary: 'Activate 2FA setup for the current user.' })
  @ApiBody({ type: UserActivateOtpDto })
  @Post('/otp/activate')
  activateOtp(@Req() req, @Body() body: UserActivateOtpDto) {
    return this.authService.activateOtp(req.user.username, body.code);
  }

  @ApiOperation({ summary: 'Deactivate 2FA setup for the current user.' })
  @ApiBody({ type: UserDeactivateOtpDto })
  @Post('/otp/deactivate')
  deactivateOtp(@Req() req, @Body() body: UserDeactivateOtpDto) {
    return this.authService.deactivateOtp(req.user.username, body.password);
  }
}
