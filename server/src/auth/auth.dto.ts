import { IsString, IsNotEmpty, IsOptional, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly username: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  readonly otp?: string;
}

export class TokensDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly accessToken: string;
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly refreshToken: string;
}

export class UserTokensDto extends TokensDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly username: string;
}
