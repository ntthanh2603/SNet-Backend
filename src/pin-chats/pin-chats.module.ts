import { Module } from '@nestjs/common';
import { PinChatsService } from './pin-chats.service';
import { PinChatsController } from './pin-chats.controller';

@Module({
  controllers: [PinChatsController],
  providers: [PinChatsService],
})
export class PinChatsModule {}
