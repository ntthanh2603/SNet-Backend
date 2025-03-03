import { Module } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { HashtagsController } from './hashtags.controller';

@Module({
  controllers: [HashtagsController],
  providers: [HashtagsService],
})
export class HashtagsModule {}
