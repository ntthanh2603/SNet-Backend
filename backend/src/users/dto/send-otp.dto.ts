import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: 'Email không được trống' })
  @ApiProperty({ example: '22022624@vnu.edu.vn', description: 'email' })
  email: string;

  @MinLength(2)
  @MaxLength(20)
  @IsString()
  @IsNotEmpty({ message: 'Last username not empty' })
  @ApiProperty({
    example: 'Nguyễn Tuấn Thành',
    description: 'Your last username',
  })
  username: string;
}
