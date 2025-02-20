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
    BullModule.forRootAsync({
      imports: [ConfigModule], // Đảm bảo ConfigModule được import vào
      inject: [ConfigService], // Inject ConfigService
      useFactory: async (
        configService: ConfigService,
      ): Promise<QueueOptions> => {
        const redisHost = configService.get<string>('BULLMQ_HOST');
        const redisPort = configService.get<number>('BULLMQ_PORT');
        const redisPassword = configService.get<string>('BULLMQ_PASSWORD');
        const redisDb = configService.get<number>('BULLMQ_DB', 1);

        return {
          connection: {
            host: redisHost,
            port: redisPort,
            password: redisPassword,
            db: redisDb,
          },
        };
      },
    }),
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
