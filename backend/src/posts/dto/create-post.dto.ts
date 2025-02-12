import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PrivacyType } from 'src/helper/helper.enum';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  @MaxLength(256)
  @MinLength(1)
  @ApiProperty({ example: 'Hello world', description: 'content' })
  content: string;

  @IsOptional()
  @ApiProperty({
    example: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
    description: 'medias',
  })
  medias: string[];

  @IsEnum(PrivacyType)
  @IsNotEmpty()
  @ApiProperty({ example: PrivacyType.PUBLIC, description: 'privacy' })
  privacy: PrivacyType;
}
