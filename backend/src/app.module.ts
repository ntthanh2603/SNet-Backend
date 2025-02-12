import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { RelationShipsModule } from './relation-ships/relation-ships.module';
import { DeviceSessionsModule } from './device-sessions/device-sessions.module';
import { PostsModule } from './posts/posts.module';

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
    UsersModule,
    AuthModule,
    RedisModule,
    RelationShipsModule,
    DeviceSessionsModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
