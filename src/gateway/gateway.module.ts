import { GatewayGateway } from './gategate.gateway';
import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { AuthModule } from 'src/auth/auth.module';
import { WsAuthMiddleware } from './ws-auth.middleware';

@Module({
  imports: [AuthModule],
  providers: [GatewayService, GatewayGateway, WsAuthMiddleware],
})
export class GatewayModule {}
