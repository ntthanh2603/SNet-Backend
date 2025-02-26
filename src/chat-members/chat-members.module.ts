import { Module } from '@nestjs/common';
import { ChatMembersService } from './chat-members.service';
import { ChatMembersController } from './chat-members.controller';

@Module({
  controllers: [ChatMembersController],
  providers: [ChatMembersService],
})
export class ChatMembersModule {}
