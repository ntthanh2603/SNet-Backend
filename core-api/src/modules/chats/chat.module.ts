import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/core/multer.config';

import { ChatMember } from './entities/chat-member.entity';
import { WaitingMembers } from './entities/waiting-members.entity';

import { RedisModule } from 'src/redis/redis.module';
import { NotificationModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { ChatMembersService } from './chat-members.service';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatRoomsController } from './chat-rooms.controller';
import { ChatMembersController } from './chat-members.controller';
import { ChatMessagesController } from './chat-messages.controller';
import { ChatMessagesService } from './chat-messages.service';
import { ChatRoomsService } from './chat-rooms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRoom,
      ChatMember,
      WaitingMembers,
      ChatMessage,
    ]),
    RedisModule,
    NotificationModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    UsersModule,
  ],
  controllers: [
    ChatRoomsController,
    ChatMembersController,
    ChatMessagesController,
  ],
  providers: [ChatRoomsService, ChatMembersService, ChatMessagesService],
  exports: [ChatRoomsService, ChatMembersService, ChatMessagesService],
})
export class ChatModule {}
