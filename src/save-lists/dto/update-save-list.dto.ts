import { PartialType } from '@nestjs/swagger';
import { CreateSaveListDto } from './create-save-list.dto';

export class UpdateSaveListDto extends PartialType(CreateSaveListDto) {}
