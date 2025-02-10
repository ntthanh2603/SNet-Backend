import { forwardRef, Module } from '@nestjs/common';
import { DeviceSessionsService } from './device-sessions.service';
import { DeviceSessionsController } from './device-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceSession } from './entities/device-session.entity';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceSession]),
    DatabaseModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [DeviceSessionsController],
  providers: [DeviceSessionsService],
  exports: [DeviceSessionsService],
})
export class DeviceSessionsModule {}
