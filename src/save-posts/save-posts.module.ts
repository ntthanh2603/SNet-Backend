import { Module } from '@nestjs/common';
import { SavePostsService } from './save-posts.service';
import { SavePostsController } from './save-posts.controller';

@Module({
  controllers: [SavePostsController],
  providers: [SavePostsService],
})
export class SavePostsModule {}
