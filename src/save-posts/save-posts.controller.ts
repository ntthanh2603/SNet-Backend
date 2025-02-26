import { Controller } from '@nestjs/common';
import { SavePostsService } from './save-posts.service';

@Controller('save-posts')
export class SavePostsController {
  constructor(private readonly savePostsService: SavePostsService) {}
}
