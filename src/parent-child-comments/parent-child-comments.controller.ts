import { Controller } from '@nestjs/common';
import { ParentChildCommentsService } from './parent-child-comments.service';

@Controller('parent-child-comments')
export class ParentChildCommentsController {
  constructor(
    private readonly parentChildCommentsService: ParentChildCommentsService,
  ) {}
}
