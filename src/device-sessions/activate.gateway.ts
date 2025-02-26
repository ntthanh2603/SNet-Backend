import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';
import { DeviceSessionsService } from './device-sessions.service';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
  namespace: 'activate',
})
@Injectable()
export class ActivateGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly redisService: RedisService,
    private readonly deviceSessionsService: DeviceSessionsService,
  ) {}

  async handleConnection(socket: Socket) {
    const authHeader = socket.handshake.headers.authorization;

    if (authHeader) {
      try {
        const payload =
          this.deviceSessionsService.handleVerifyToken(authHeader);

        const { id } = payload;

        socket.data.userId = id;

        const isActivate = Number(
          await this.redisService.get(`activate:${id}`),
        );

        if (!isActivate)
          await this.redisService.set(`activate:${id}`, 1, 86400);

        await this.redisService.set(`activate:${id}`, isActivate + 1, 86400);
      } catch {
        socket.disconnect();
      }
    } else {
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    const userId = socket.data.userId;

    const isActivate = Number(
      await this.redisService.get(`activate:${userId}`),
    );

    if (isActivate > 1)
      await this.redisService.set(`activate:${userId}`, isActivate - 1, 86400);

    await this.redisService.del(`activate:${userId}`);
  }
}
