import { Module } from '@nestjs/common';
import { ChatModule } from './chats/chat.module';

@Module({
  imports: [ChatModule],
})
export class CombineModule {}
