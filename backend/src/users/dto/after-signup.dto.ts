import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GenderType } from 'src/helper/helper.enum';

export class AfterSignUpDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  @MinLength(6)
  @ApiProperty({ example: '123123', description: 'otp' })
  otp: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '22022624@vnu.edu.vn', description: 'email' })
  email: string;

  @MinLength(8)
  @MaxLength(15)
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

  @ApiProperty({ example: 'Good boy', description: 'bio' })
  @IsString()
  @IsOptional()
  bio: string;

  @ApiProperty({
    example: 'https://github.com/ntthanh2603',
    description: 'website',
  })
  @IsString()
  @IsOptional()
  website: string;

  @ApiProperty({
    example: '2025-02-11 08:14:57.142000',
    description: 'birthday',
  })
  @IsOptional()
  birthday: Date;

  @ApiProperty({ example: GenderType.MALE, description: 'gender' })
  @IsOptional()
  gender: GenderType;

  @ApiProperty({ example: 'Cau Giay, Ha Noi', description: 'address' })
  @IsString()
  @IsOptional()
  address: string;
}
