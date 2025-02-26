import { PartialType } from '@nestjs/swagger';
import { CreateReactionCommentDto } from './create-reaction-comment.dto';

export class UpdateReactionCommentDto extends PartialType(CreateReactionCommentDto) {}
