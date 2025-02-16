import { RedisModule } from './../redis/redis.module';
import { forwardRef, Module } from '@nestjs/common';
import { DeviceSessionsService } from './device-sessions.service';
import { DeviceSessionsController } from './device-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceSession } from './entities/device-session.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceSession]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UsersModule),
    RedisModule,
  ],
  controllers: [DeviceSessionsController],
  providers: [DeviceSessionsService],
  exports: [DeviceSessionsService],
})
export class DeviceSessionsModule {}
