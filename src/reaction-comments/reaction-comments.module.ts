import { Module } from '@nestjs/common';
import { ReactionCommentsService } from './reaction-comments.service';
import { ReactionCommentsController } from './reaction-comments.controller';

@Module({
  controllers: [ReactionCommentsController],
  providers: [ReactionCommentsService],
})
export class ReactionCommentsModule {}
