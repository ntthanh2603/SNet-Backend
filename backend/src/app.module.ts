import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transports: {
          host: configService.get('MAIL_HOST'),
          port: 587,
          secure: false,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get('MAIL_FORM')}>`,
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
