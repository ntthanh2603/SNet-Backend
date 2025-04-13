import { Hashtag } from './../../hashtags/entities/hashtag.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PrivacyType } from 'src/helper/privacy.enum';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  @MaxLength(256)
  @MinLength(1)
  @ApiProperty({ example: 'Hello world', description: 'content' })
  content: string;

  @IsOptional()
  @ApiProperty({
    example: ['human', 'it', 'life'],
    description: 'hashtags',
  })
  hashtags: string[];

  @IsEnum(PrivacyType)
  @IsNotEmpty()
  @ApiProperty({ example: PrivacyType.PUBLIC, description: 'privacy' })
  privacy: PrivacyType;
}
