import { Module } from '@nestjs/common';
import { ChatMembersService } from './chat-members.service';
import { ChatMembersController } from './chat-members.controller';
import { ChatMember } from './entities/chat-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/core/multer.config';
import { ChatRoom } from 'src/chat-rooms/entities/chat-room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMember]),
    TypeOrmModule.forFeature([ChatRoom]),
    RedisModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [ChatMembersController],
  providers: [ChatMembersService],
})
export class ChatMembersModule {}
