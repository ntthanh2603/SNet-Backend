import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAccountWithGoogleDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@gmail.com', description: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '12345678', description: 'password' })
  password: string;

  @ApiProperty({
    example: 'abc.jpg',
    description: 'Your avatar',
  })
  @IsOptional()
  avatar: string;

  @MinLength(2)
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Nguyễn Tuấn Thành',
    description: 'Your last username',
  })
  username: string;
}
