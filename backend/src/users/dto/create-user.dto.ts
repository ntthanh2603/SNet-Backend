import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GenderType } from 'src/helper/helper.enum';

export class RegisterUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: 'Email không được trống' })
  @ApiProperty({ example: 'user@gmail.com', description: 'email' })
  email: string;

  @MinLength(8)
  @MaxLength(15)
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được trống' })
  @ApiProperty({ example: '12345678', description: 'password' })
  password: string;

  @MinLength(2)
  @MaxLength(20)
  @IsString()
  @IsNotEmpty({ message: 'Last username not empty' })
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

  @ApiProperty({ example: 20, description: 'age' })
  @IsNumber()
  @IsOptional()
  age: number;

  @ApiProperty({ example: GenderType.MALE, description: 'gender' })
  @IsOptional()
  gender: GenderType;

  @ApiProperty({ example: 'Cau Giay, Ha Noi', description: 'address' })
  @IsString()
  @IsOptional()
  address: string;
}
