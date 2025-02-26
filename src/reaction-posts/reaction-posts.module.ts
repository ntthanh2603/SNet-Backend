import { Module } from '@nestjs/common';
import { ReactionPostsService } from './reaction-posts.service';
import { ReactionPostsController } from './reaction-posts.controller';

@Module({
  controllers: [ReactionPostsController],
  providers: [ReactionPostsService],
})
export class ReactionPostsModule {}
