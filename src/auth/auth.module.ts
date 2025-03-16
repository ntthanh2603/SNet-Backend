import { Module } from '@nestjs/common';
// import { LocalStrategy } from './passpost/local.strategy';
import { JwtStrategy } from './passpost/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { DeviceSessionsModule } from 'src/device-sessions/device-sessions.module';

@Module({
  imports: [UsersModule, DeviceSessionsModule],
  controllers: [],
  providers: [JwtStrategy],
  exports: [],
})
export class AuthModule {}
