import { RedisModule } from './../redis/redis.module';
import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullMQController } from './bullmq.controller';
import { BullModule } from '@nestjs/bullmq';
import { BullMQService } from './bullmq.service';
import { SendEmailProcessor } from './send-email.processor';
import { NotiBirthdayProcessor } from './notification-birthday.processor';

@Global()
@Module({
  imports: [
    ConfigModule,
    RedisModule,
    BullModule.registerQueue({ name: 'sendEmail' }),
    BullModule.registerQueue({ name: 'notificationBirthdays' }),
  ],
  controllers: [BullMQController],
  providers: [BullMQService, SendEmailProcessor, NotiBirthdayProcessor],
  exports: [NotiBirthdayProcessor],
})
export class BullMQModule {}
