import { Controller } from '@nestjs/common';
import { ReactionPostsService } from './reaction-posts.service';

@Controller('reaction-posts')
export class ReactionPostsController {
  constructor(private readonly reactionPostsService: ReactionPostsService) {}
}
