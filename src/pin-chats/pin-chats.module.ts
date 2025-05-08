import { Module } from '@nestjs/common';
import { PinChatsService } from './pin-chats.service';
import { PinChatsController } from './pin-chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PinChat } from './entities/pin-chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PinChat])],
  controllers: [PinChatsController],
  providers: [PinChatsService],
})
export class PinChatsModule {}
