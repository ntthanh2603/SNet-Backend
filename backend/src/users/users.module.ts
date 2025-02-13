import { RelationShipsModule } from './../relation-ships/relation-ships.module';
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RedisModule } from 'src/redis/redis.module';
import { DeviceSessionsModule } from 'src/device-sessions/device-sessions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisModule,
    forwardRef(() => RelationShipsModule),
    forwardRef(() => DeviceSessionsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
