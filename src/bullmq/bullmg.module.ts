import { RedisModule } from './../redis/redis.module';
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullMQController } from './bullmq.controller';
import { BullModule } from '@nestjs/bullmq';
import { QueueOptions } from 'bullmq';
import { NotificationProcessor } from './notification.processor';
import { BullMQService } from './bullmq.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    
    RedisModule,
    BullModule.registerQueue(
      { name: 'notifications' }, // Queue thông báo
    ),
  ],
  controllers: [BullMQController],
  providers: [NotificationProcessor, BullMQService],
  exports: [],
})
export class BullMQModule {}
