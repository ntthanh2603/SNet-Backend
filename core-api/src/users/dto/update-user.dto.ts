import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { GenderType } from 'src/helper/gender.enum';
import { PrivacyType } from 'src/helper/privacy.enum';

export class UpdateUserDto {
  @MinLength(2)
  @MaxLength(20)
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Thành', description: 'Your last username' })
  username: string;

  @ApiProperty({ example: 'Good boy', description: 'bio' })
  @MinLength(5, { message: 'Bio not less than 5 characters' })
  @MaxLength(100, { message: 'Bio not more than 100 characters' })
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

  @ApiProperty({
    example: '2025-02-11 08:14:57.142000',
    description: 'Birthday',
  })
  @IsOptional()
  birthday: Date;

  @ApiProperty({ example: GenderType.MALE, description: 'gender' })
  @IsOptional()
  gender: GenderType;

  @ApiProperty({ example: 'Cau Giay, Ha Noi', description: 'address' })
  @MinLength(5, { message: 'Address min lenth is 5' })
  @MaxLength(100, { message: 'Address max lenth is 100' })
  @IsOptional()
  address: string;

  @ApiProperty({ example: PrivacyType.PUBLIC, description: 'privacy' })
  @IsOptional()
  privacy: PrivacyType;
}
