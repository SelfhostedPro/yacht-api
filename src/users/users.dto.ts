import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  Equals,
  IsDefined,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  username?: string;

  @ApiProperty()
  @IsBoolean()
  admin?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ writeOnly: true })
  password?: string;

  @Equals(undefined)
  hashedPassword?: string;

  @Equals(undefined)
  otpSecret?: string;

  @Equals(undefined)
  @ApiProperty({ readOnly: true })
  otpActive?: boolean;

  @Equals(undefined)
  @ApiProperty()
  refreshToken?: string
}

export class UserDto {
  @IsNumber()
  @ApiProperty({ readOnly: true })
  id?: number;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  username: string;

  @ApiProperty()
  @IsBoolean()
  admin: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ writeOnly: true })
  password?: string;

  @Equals(undefined)
  hashedPassword?: string;

  @Equals(undefined)
  salt?: string;

  @Equals(undefined)
  otpSecret?: string;

  @Equals(undefined)
  @ApiProperty({ readOnly: true })
  otpActive?: boolean;

  @Equals(undefined)
  @ApiProperty()
  refreshToken?: string
}

export class UserUpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;
}

export class UserActivateOtpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;
}

export class UserDeactivateOtpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
