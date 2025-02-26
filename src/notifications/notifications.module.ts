import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { ConfigModule } from '@nestjs/config';
import { BullMQModule } from 'src/bullmq/bullmg.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Notification]),
    BullMQModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
