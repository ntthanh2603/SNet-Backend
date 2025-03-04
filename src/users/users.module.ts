import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RedisModule } from 'src/redis/redis.module';
import { DeviceSessionsModule } from 'src/device-sessions/device-sessions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BirthdayJob } from './birthday.job';
import { NotificationModule } from 'src/notifications/notifications.module';
import { BullModule } from '@nestjs/bullmq';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/core/multer.config';
import { RelationsModule } from 'src/relations/relations.module';
import { NestjsFingerprintModule } from 'nestjs-fingerprint';

@Module({
  imports: [
    NestjsFingerprintModule.forRoot({
      params: ['headers', 'userAgent', 'ipAddress'],
      cookieOptions: {
        name: 'your_cookie_name', // optional
        httpOnly: true, // optional
      },
    }),
    TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    RedisModule,
    forwardRef(() => RelationsModule),
    forwardRef(() => DeviceSessionsModule),
    BullModule.registerQueue({ name: 'sendEmail' }),
    BullModule.registerQueue({ name: 'notificationBirthdays' }),
    ScheduleModule.forRoot(),
    NotificationModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, BirthdayJob],
  exports: [UsersService],
})
export class UsersModule {}
