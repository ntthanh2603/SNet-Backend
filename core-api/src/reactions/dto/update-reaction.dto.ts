import { PartialType } from '@nestjs/swagger';
import { CreateReactionDto } from './create-reaction.dto';

export class UpdateReactionDto extends PartialType(CreateReactionDto) {}
