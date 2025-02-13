import { Injectable } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationService } from 'src/notifications/notifications.service';
import { Notification } from 'src/notifications/entities/notification.entity';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationQueue {
  private queue: Queue;
  constructor(
    private readonly configService: ConfigService,
    private notificationService: NotificationService,
    @InjectRepository(Notification)
    // private notificationRepo: Repository<Notification>,
    private readonly redisService: RedisService,
  ) {
    this.queue = new Queue('notification-queue', {
      connection: {
        host: configService.get<string>('REDIS_HOST') || 'localhost',
        port: configService.get<number>('REDIS_PORT') || 6379,
        password: configService.get<string>('REDIS_PASSWORD') || undefined,
        db: configService.get<number>('REDIS_DB') || 0,
        keyPrefix: configService.get<string>('REDIS_KEY_PREFIX') || '',
        tls: configService.get<boolean>('REDIS_TLS') ? {} : undefined,
        maxRetriesPerRequest: null,
      },
    });
    new Worker(
      'notification-queue',
      async (job) => {
        console.log('Processing job:', job.data);
      },
      {
        connection: {
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT') || 6379,
          password: configService.get<string>('REDIS_PASSWORD') || undefined,
          db: configService.get<number>('REDIS_DB') || 0,
          keyPrefix: configService.get<string>('REDIS_KEY_PREFIX') || '',
          tls: configService.get<boolean>('REDIS_TLS') ? {} : undefined,
          maxRetriesPerRequest: null,
        },
      },
    );
  }
  async addBirthdayNotification(userId: string, username: string) {
    console.log(`📌 Adding birthday notification for ${username}`);
    await this.queue.add('birthdayNotification', { userId, username });
  }
}
