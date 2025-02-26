import { Controller } from '@nestjs/common';
import { ReactionCommentsService } from './reaction-comments.service';

@Controller('reaction-comments')
export class ReactionCommentsController {
  constructor(
    private readonly reactionCommentsService: ReactionCommentsService,
  ) {}
}
