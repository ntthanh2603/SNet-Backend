import { RedisModule } from './../redis/redis.module';
import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullMQController } from './bullmq.controller';
import { BullModule } from '@nestjs/bullmq';
import { BullMQService } from './bullmq.service';
import { SendEmailProcessor } from './send-email.processor';
import { NotiSystemProcessor } from './noti-system.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { NotificationUser } from 'src/notification-users/entities/notification-user.entity';

@Global()
@Module({
  imports: [
    ConfigModule,
    RedisModule,
    BullModule.registerQueue({ name: 'send-email' }),
    BullModule.registerQueue({ name: 'noti-birthday' }),
    BullModule.registerQueue({ name: 'noti-system' }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([NotificationUser]),
  ],
  controllers: [BullMQController],
  providers: [BullMQService, SendEmailProcessor, NotiSystemProcessor],
  exports: [SendEmailProcessor, NotiSystemProcessor],
})
export class BullMQModule {}
