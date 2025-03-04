import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { DeviceSessionsModule } from './device-sessions/device-sessions.module';
import { PostsModule } from './posts/posts.module';
import { NotificationModule } from './notifications/notifications.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BullMQModule } from './bullmq/bullmg.module';
import { join } from 'path';
import { BullModule } from '@nestjs/bullmq';
import { QueueOptions } from 'bullmq';
import { AppController } from './app.controller';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { ChatMembersModule } from './chat-members/chat-members.module';
import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';
import { ChatMessagesModule } from './chat-messages/chat-messages.module';
import { SavePostsModule } from './save-posts/save-posts.module';
import { CommentsModule } from './comments/comments.module';
import { RelationsModule } from './relations/relations.module';
import { NotificationUsersModule } from './notification-users/notification-users.module';
import { SaveListsModule } from './save-lists/save-lists.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ParentChildCommentsModule } from './parent-child-comments/parent-child-comments.module';
import { SearchEngineModule } from './search-engine/search-engine.module';

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
      imports: [ConfigModule],
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
      inject: [ConfigService],
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
        // transport: configService.get('MAIL_TRANSPORT'),
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
    RelationsModule,
    DeviceSessionsModule,
    PostsModule,
    NotificationModule,
    BullMQModule,
    ChatMembersModule,
    ChatRoomsModule,
    ChatMessagesModule,
    SavePostsModule,
    CommentsModule,
    NotificationUsersModule,
    SaveListsModule,
    HashtagsModule,
    ReactionsModule,
    ParentChildCommentsModule,
    SearchEngineModule,
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
