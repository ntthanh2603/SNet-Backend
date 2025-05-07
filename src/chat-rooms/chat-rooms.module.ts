import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoomsController } from './chat-rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { NotificationModule } from 'src/notifications/notifications.module';
import { RedisModule } from 'src/redis/redis.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/core/multer.config';
import { ChatMembersModule } from 'src/chat-members/chat-members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom]),
    NotificationModule,
    RedisModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    ChatMembersModule,
  ],
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService],
})
export class ChatRoomsModule {}
