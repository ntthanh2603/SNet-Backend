import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class AfterForgotPasswordDto {
  @IsString()
  @Length(6, 6)
  @ApiProperty({ example: '123123', description: 'otp' })
  otp: string;

  @IsString()
  @ApiProperty({ example: 'user@gmail.com', description: 'email' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'Nguyễn Tuấn Thành', description: 'username' })
  username: string;

  @IsString()
  @ApiProperty({ example: '12345678', description: 'password' })
  @Length(8, 15)
  password: string;
}
