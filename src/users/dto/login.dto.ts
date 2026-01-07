import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: '123456' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'unique-device-id' })
  deviceId: string;
}
