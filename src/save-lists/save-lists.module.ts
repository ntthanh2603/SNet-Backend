import { Module } from '@nestjs/common';
import { SaveListsService } from './save-lists.service';
import { SaveListsController } from './save-lists.controller';

@Module({
  controllers: [SaveListsController],
  providers: [SaveListsService],
})
export class SaveListsModule {}
