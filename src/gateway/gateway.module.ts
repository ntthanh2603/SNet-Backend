import { GatewayGateway } from './gategate.gateway';
import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddlewareGateway } from 'src/middleware/auth.middleware.gateway';

@Module({
  imports: [AuthModule],
  providers: [GatewayService, GatewayGateway, AuthMiddlewareGateway],
})
export class GatewayModule {}
