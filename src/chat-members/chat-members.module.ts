import { forwardRef, Module } from '@nestjs/common';
import { ChatMembersService } from './chat-members.service';
import { ChatMembersController } from './chat-members.controller';
import { ChatMember } from './entities/chat-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/core/multer.config';
import { ChatRoomsModule } from 'src/chat-rooms/chat-rooms.module';
import { UsersModule } from 'src/users/users.module';
import { WaitingMembers } from './entities/waiting-members.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WaitingMembers]),
    TypeOrmModule.forFeature([ChatMember]),
    RedisModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    forwardRef(() => ChatRoomsModule),
    UsersModule,
  ],
  controllers: [ChatMembersController],
  providers: [ChatMembersService],
  exports: [ChatMembersService],
})
export class ChatMembersModule {}
