import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { GenderType, PrivacyType } from 'src/helper/helper.enum';

export class UpdateUserDto {
  @MinLength(2)
  @MaxLength(20)
  @IsString()
  @IsNotEmpty({ message: 'Last username not empty' })
  @ApiProperty({ example: 'Thành', description: 'Your last username' })
  username: string;

  @ApiProperty({ example: 'Good boy', description: 'bio' })
  @MinLength(5, { message: 'Bio không được nhỏ hơn 5 ký tự' })
  @MaxLength(100, { message: 'Bio không được lớn hơn 100 ký tự' })
  @IsOptional()
  bio: string;

  @ApiProperty({
    example: 'https://github.com/ntthanh2603',
    description: 'website',
  })
  @MinLength(5)
  @MaxLength(100)
  @IsOptional()
  website: string;

  @ApiProperty({ example: 20, description: 'age' })
  @Max(100, { message: 'Tuổi không được lớn hơn 100' })
  @Min(1, { message: 'Tuổi không được nhỏ hơn 1' })
  @IsOptional()
  age: number;

  @ApiProperty({ example: GenderType.MALE, description: 'gender' })
  @IsOptional()
  gender: GenderType;

  @ApiProperty({ example: 'Cau Giay, Ha Noi', description: 'address' })
  @MinLength(5, { message: 'Địa chỉ không được nhỏ hơn 5 ký tự' })
  @MaxLength(100, { message: 'Địa chỉ không được lớn hơn 100 ký tự' })
  @IsOptional()
  address: string;

  @ApiProperty({ example: PrivacyType.PUBLIC, description: 'privacy' })
  @IsOptional()
  privacy: PrivacyType;
}
