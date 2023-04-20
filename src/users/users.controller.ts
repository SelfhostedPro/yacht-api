import {
  Controller,
  UseGuards,
  Body,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import {
  UserDto,
} from './users.dto';

@ApiTags('User Management')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
    ) { }

  @UseGuards(AdminGuard)
  @ApiResponse({ type: UserDto, isArray: true, status: 200 })
  @ApiOperation({ summary: 'List of existing users.' })
  @Get()
  getUsers() {
    return this.usersService.get(true);
  }

  @UseGuards(AdminGuard)
  @ApiResponse({ type: UserDto, status: 201 })
  @ApiOperation({ summary: 'Create a new user.' })
  @Post()
  addUser(@Body() body: UserDto) {
    return this.usersService.create(body);
  }

  @UseGuards(AdminGuard)
  @ApiResponse({ type: UserDto, status: 200 })
  @ApiOperation({ summary: 'Update a user.' })
  @ApiParam({ name: 'userId', type: 'number' })
  @Patch('/:userId(\\d+)')
  updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: UserDto,
  ) {
    return this.usersService.update(userId, body);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a user.' })
  @ApiParam({ name: 'userId', type: 'number' })
  @Delete('/:userId(\\d+)')
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.delete(userId);
  }

}
