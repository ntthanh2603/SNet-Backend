import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { AuthMiddlewareGateway } from 'src/middleware/auth.middleware.gateway';
import { RedisService } from 'src/redis/redis.service';

@WebSocketGateway({
  cors: true,
  pingInterval: 10000,
  pingTimeout: 20000,
})
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly authMiddleware: AuthMiddlewareGateway,
  ) {}

  afterInit() {
    console.log('WebSocket initialized');
    this.server.use((socket: Socket, next) =>
      this.authMiddleware.use(socket, next),
    );
  }

  async handleConnection(socket: Socket) {
    await this.redisService.incr(`connection_number:${socket.data.user.id}`);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const connectionNumber = await this.redisService.get(
      `connection_number:${socket.data.user.id}`,
    );
    if (parseInt(connectionNumber) === 1) {
      await this.redisService.del(`connection_number:${socket.data.user.id}`);
    } else {
      await this.redisService.decr(`connection_number:${socket.data.user.id}`);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    console.log('message', data);
    setTimeout(() => {
      this.server.to(socket.data.email + '1').emit('message', data);
    }, 1000);
  }
}
