import { PartialType } from '@nestjs/swagger';
import { CreateReactionPostDto } from './create-reaction-post.dto';

export class UpdateReactionPostDto extends PartialType(CreateReactionPostDto) {}
