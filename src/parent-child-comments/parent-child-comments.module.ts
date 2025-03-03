import { Module } from '@nestjs/common';
import { ParentChildCommentsService } from './parent-child-comments.service';
import { ParentChildCommentsController } from './parent-child-comments.controller';

@Module({
  controllers: [ParentChildCommentsController],
  providers: [ParentChildCommentsService],
})
export class ParentChildCommentsModule {}
