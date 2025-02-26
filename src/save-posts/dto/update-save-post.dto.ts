import { PartialType } from '@nestjs/swagger';
import { CreateSavePostDto } from './create-save-post.dto';

export class UpdateSavePostDto extends PartialType(CreateSavePostDto) {}
