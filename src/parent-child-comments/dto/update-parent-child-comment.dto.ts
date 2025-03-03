import { PartialType } from '@nestjs/swagger';
import { CreateParentChildCommentDto } from './create-parent-child-comment.dto';

export class UpdateParentChildCommentDto extends PartialType(CreateParentChildCommentDto) {}
