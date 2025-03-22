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
  @IsNotEmpty({ message: 'Email not empty' })
  @ApiProperty({ example: 'user@gmail.com', description: 'email' })
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
