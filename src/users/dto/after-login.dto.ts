import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AfterLoginDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  @MinLength(6)
  @ApiProperty({ example: '123123', description: 'otp' })
  otp: string;
  @IsNotEmpty({ message: 'Email not empty' })
  @IsEmail({}, { message: 'Email is not valid' })
  @IsString({ message: 'Type email is string' })
  @ApiProperty({ example: '22022624@vnu.edu.vn', description: 'email' })
  email: string;

  @IsNotEmpty({ message: 'Password not empty' })
  @MinLength(8, { message: 'Password not less than 8 characters' })
  @MaxLength(10, { message: 'Password not more than 10 characters' })
  @IsString({ message: 'Type password is string' })
  @ApiProperty({ example: '12345678', description: 'password' })
  password: string;
}
