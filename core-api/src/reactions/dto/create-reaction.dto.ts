import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateReactionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Post ID' })
  postId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Comment ID' })
  commentId?: string;
}
