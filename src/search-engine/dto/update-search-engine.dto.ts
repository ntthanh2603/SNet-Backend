import { PartialType } from '@nestjs/swagger';
import { CreateSearchEngineDto } from './create-search-engine.dto';

export class UpdateSearchEngineDto extends PartialType(CreateSearchEngineDto) {}
