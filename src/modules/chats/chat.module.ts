import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/core/multer.config';

import { ChatRoomsService } from './rooms/chat-rooms.service';
import { ChatRoomsController } from './rooms/chat-rooms.controller';
import { ChatRoom } from './rooms/entities/chat-room.entity';

import { ChatMembersService } from './members/chat-members.service';
import { ChatMembersController } from './members/chat-members.controller';
import { ChatMember } from './members/entities/chat-member.entity';
import { WaitingMembers } from './members/entities/waiting-members.entity';

import { ChatMessagesService } from './messages/chat-messages.service';
import { ChatMessagesController } from './messages/chat-messages.controller';
import { ChatMessage } from './messages/entities/chat-message.entity';

import { RedisModule } from 'src/redis/redis.module';
import { NotificationModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, ChatMember, WaitingMembers, ChatMessage]),
    RedisModule,
    NotificationModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    UsersModule,
  ],
  controllers: [ChatRoomsController, ChatMembersController, ChatMessagesController],
  providers: [ChatRoomsService, ChatMembersService, ChatMessagesService],
  exports: [ChatRoomsService, ChatMembersService, ChatMessagesService],
})
export class ChatModule {}
