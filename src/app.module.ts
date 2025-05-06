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
import { ReactionsModule } from './reactions/reactions.module';
import { ParentChildCommentsModule } from './parent-child-comments/parent-child-comments.module';
import { SearchEngineModule } from './search-engine/search-engine.module';
import { AdminsModule } from './admins/admins.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '...env',
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
    ReactionsModule,
    ParentChildCommentsModule,
    SearchEngineModule,
    AdminsModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // 🛡 System-wide activation speed limit
    },
  ],
})
export class AppModule {}
