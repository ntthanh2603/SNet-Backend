import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { RelationShipsModule } from './relation-ships/relation-ships.module';
import { DeviceSessionsModule } from './device-sessions/device-sessions.module';
import { PostsModule } from './posts/posts.module';
import { NotificationModule } from './notifications/notifications.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BullMQModule } from './bullmq/bullmg.module';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { join } from 'path';
import { BullModule } from '@nestjs/bullmq';
import { QueueOptions } from 'bullmq';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Để module config có thể sử dụng ở mọi nơi mà không cần import lại
      envFilePath: '...env', // Đường dẫn tới file .env
    }),
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL'),
          limit: config.get('THROTTLE_LIMIT'),
        },
      ],
    }),
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get('MAIL_POST'),
          secure: false,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"Mạng xã hội SNet"`,
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    RedisModule,
    RelationShipsModule,
    DeviceSessionsModule,
    PostsModule,
    NotificationModule,
    BullMQModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // 🛡 Kích hoạt Rate Limiting toàn hệ thống
    },
  ],
})
export class AppModule {}
