import { PartialType } from '@nestjs/swagger';
import { CreateHashtagDto } from './create-hashtag.dto';

export class UpdateHashtagDto extends PartialType(CreateHashtagDto) {}
