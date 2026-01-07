import { RedisModule } from './../redis/redis.module';
import { forwardRef, Module } from '@nestjs/common';
import { DeviceSessionsService } from './device-sessions.service';
import { DeviceSessionsController } from './device-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceSession } from './entities/device-session.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceSession]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    RedisModule,
  ],
  controllers: [DeviceSessionsController],
  providers: [DeviceSessionsService],
  exports: [DeviceSessionsService],
})
export class DeviceSessionsModule {}
