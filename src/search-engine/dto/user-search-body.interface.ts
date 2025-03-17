import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
  IsDate,
} from 'class-validator';
import { GenderType } from 'src/helper/gender.enum';
import { PrivacyType } from 'src/helper/privacy.enum';
import { RoleType } from 'src/helper/role.enum';
import { UserCategoryType } from 'src/helper/user-category.enum';

export class UserSearchBody {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty()
  @IsString()
  avatar: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  birthday?: Date;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  company?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  education?: string[];

  @ApiProperty()
  @IsOptional()
  @IsDate()
  last_active?: Date;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserCategoryType)
  user_category?: UserCategoryType;

  @ApiProperty()
  @IsEnum(PrivacyType)
  privacy: PrivacyType;

  @ApiProperty()
  @IsDate()
  created_at: Date;

  @ApiProperty()
  @IsDate()
  updated_at: Date;

  @ApiProperty()
  @IsEnum(RoleType)
  role: RoleType;
}
