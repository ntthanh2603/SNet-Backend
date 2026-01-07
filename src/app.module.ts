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
import { BullModule } from '@nestjs/bullmq';
import { QueueOptions } from 'bullmq';
import { AppController } from './app.controller';
import { SavePostsModule } from './save-posts/save-posts.module';
import { CommentsModule } from './comments/comments.module';
import { RelationsModule } from './relations/relations.module';
import { NotificationUsersModule } from './notification-users/notification-users.module';
import { SaveListsModule } from './save-lists/save-lists.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ParentChildCommentsModule } from './parent-child-comments/parent-child-comments.module';
import { AdminsModule } from './admins/admins.module';
import { GatewayModule } from './gateway/gateway.module';
import { PinMessagesModule } from './pin-messages/pin-messages.module';
import { PinChatsModule } from './pin-chats/pin-chats.module';
import { CombineModule } from './modules/combine.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    DatabaseModule,
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

    UsersModule,
    AuthModule,
    RedisModule,
    RelationsModule,
    DeviceSessionsModule,
    PostsModule,
    NotificationModule,
    BullMQModule,
    SavePostsModule,
    CommentsModule,
    NotificationUsersModule,
    SaveListsModule,
    ReactionsModule,
    ParentChildCommentsModule,
    AdminsModule,
    GatewayModule,
    PinMessagesModule,
    PinChatsModule,
    CombineModule,
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
