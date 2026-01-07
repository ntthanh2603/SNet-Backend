import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Content of the comment' })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the post to comment on' })
  post_id: string;
}
