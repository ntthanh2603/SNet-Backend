import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PrivacyType } from 'src/helper/helper.enum';

export class UpdatePostDto {
  // @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '452a1e21-d4eb-4f14-a52f-fbfaf0bb7d99',
    description: 'id',
  })
  id: string;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  @MinLength(0)
  @ApiProperty({ example: 'Hello world', description: 'content' })
  content: string;

  @IsOptional()
  @ApiProperty({
    example: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
    description: 'medias',
  })
  @IsArray()
  medias: string[];

  @IsEnum(PrivacyType)
  @IsNotEmpty()
  @ApiProperty({ example: PrivacyType.PUBLIC, description: 'privacy' })
  privacy: PrivacyType;
}
