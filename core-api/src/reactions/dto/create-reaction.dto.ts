import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReactionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'post-id-123', description: 'Post or Comment ID' })
  post_comment_id: string;
}
