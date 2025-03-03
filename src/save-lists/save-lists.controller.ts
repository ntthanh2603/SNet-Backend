import { Controller } from '@nestjs/common';
import { SaveListsService } from './save-lists.service';

@Controller('save-lists')
export class SaveListsController {
  constructor(private readonly saveListsService: SaveListsService) {}
}
