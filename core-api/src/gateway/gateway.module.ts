import { GatewayGateway } from './gategate.gateway';
import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { AuthModule } from 'src/auth/auth.module';
import { WsAuthMiddleware } from './ws-auth.middleware';
import { NotificationUsersModule } from 'src/notification-users/notification-users.module';

@Module({
  imports: [AuthModule, NotificationUsersModule],
  providers: [GatewayService, GatewayGateway, WsAuthMiddleware],
  exports: [GatewayGateway],
})
export class GatewayModule {}
