import { RelationShipsModule } from './../relation-ships/relation-ships.module';
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
import { EmailService } from './email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisModule,
    forwardRef(() => RelationShipsModule),
    forwardRef(() => DeviceSessionsModule),
    ScheduleModule.forRoot(),
    NotificationModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, BirthdayJob, EmailService],
  exports: [UsersService],
})
export class UsersModule {}
