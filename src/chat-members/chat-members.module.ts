import { forwardRef, Module } from '@nestjs/common';
import { ChatMembersService } from './chat-members.service';
import { ChatMembersController } from './chat-members.controller';
import { ChatMember } from './entities/chat-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/core/multer.config';
import { ChatRoom } from 'src/chat-rooms/entities/chat-room.entity';
import { ChatRoomsModule } from 'src/chat-rooms/chat-rooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMember]),
    TypeOrmModule.forFeature([ChatRoom]),
    RedisModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    forwardRef(() => ChatRoomsModule),
  ],
  controllers: [ChatMembersController],
  providers: [ChatMembersService],
  exports: [ChatMembersService],
})
export class ChatMembersModule {}
