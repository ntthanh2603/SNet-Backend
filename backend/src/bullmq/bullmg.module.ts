import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { BullMQService } from './bullmq.service';
import { BullMQController } from './bullmq.controller';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [BullMQController],
  providers: [
    {
      provide: 'BULL_QUEUE',
      useFactory: (configService: ConfigService) => {
        return new Queue('queue', {
          connection: {
            host: configService.get<string>('BULLMQ_HOST') || 'localhost',
            port: configService.get<number>('BULLMQ_PORT') || 6379,
            password: configService.get<string>('BULLMQ_PASSWORD') || undefined,
            db: configService.get<number>('BULLMQ_DB') || 1,
            tls: configService.get<boolean>('BULLMQ_TLS') ? {} : undefined,
          },
        });
      },
      inject: [ConfigService],
    },
    BullMQService,
  ],
  exports: ['BULL_QUEUE', BullMQService],
})
export class BullMQModule {}
