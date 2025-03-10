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
  @IsNotEmpty({ message: 'Email không được trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsString({ message: 'Type email is string' })
  @ApiProperty({ example: '22022624@vnu.edu.vn', description: 'email' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được trống' })
  @MinLength(8, { message: 'Mật khẩu không được dưới 8 kí tự' })
  @MaxLength(10, { message: 'Mật Khẩu không được trên 10 kí tự' })
  @IsString({ message: 'Type password is string' })
  @ApiProperty({ example: '12345678', description: 'password' })
  password: string;
}
