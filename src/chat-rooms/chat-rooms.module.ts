import { forwardRef, Module } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoomsController } from './chat-rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { NotificationModule } from 'src/notifications/notifications.module';
import { RedisModule } from 'src/redis/redis.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/core/multer.config';
import { ChatMembersModule } from 'src/chat-members/chat-members.module';
import { ChatMember } from 'src/chat-members/entities/chat-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom]),
    TypeOrmModule.forFeature([ChatMember]),
    NotificationModule,
    RedisModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    forwardRef(() => ChatMembersModule),
  ],
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService],
  exports: [ChatRoomsService],
})
export class ChatRoomsModule {}
