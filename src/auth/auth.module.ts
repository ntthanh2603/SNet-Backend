import { Module } from '@nestjs/common';
import { LocalStrategy } from './passpost/local.strategy';
import { JwtStrategy } from './passpost/jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [LocalStrategy, JwtStrategy],
  exports: [],
})
export class AuthModule {}
