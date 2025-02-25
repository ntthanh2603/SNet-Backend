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
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisModule,
    forwardRef(() => RelationShipsModule),
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
