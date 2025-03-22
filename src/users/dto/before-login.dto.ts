import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BeforeLoginDto {
  @IsNotEmpty({ message: 'Email not empty' })
  @IsEmail({}, { message: 'Email not valid' })
  @IsString({ message: 'Type email is string' })
  @ApiProperty({ example: 'user@gmail.com', description: 'email' })
  email: string;

  @IsNotEmpty({ message: 'Password not empty' })
  @MinLength(8, { message: 'Password not less than 8 characters' })
  @MaxLength(10, { message: 'Password not more than 10 characters' })
  @IsString({ message: 'Type password is string' })
  @ApiProperty({ example: '12345678', description: 'password' })
  password: string;
}
