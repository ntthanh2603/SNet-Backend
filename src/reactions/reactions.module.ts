import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
