import { NotificationUsersService } from './../notification-users/notification-users.service';
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
import { RedisService } from 'src/redis/redis.service';
import { WsAuthMiddleware } from './ws-auth.middleware';
import { INotiUser } from 'src/notifications/notification.interface';

/*
    Client -->|Gửi tin| Redis;
    Redis -->|Phản hồi nhanh| Client;
    Redis -->|Lưu vào hàng đợi| BullMQ;
    BullMQ -->|Ghi tin nhắn vào DB| PostgreSQL;
    Client -->|Yêu cầu tin nhắn cũ| PostgreSQL;
*/

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
    private readonly redisService: RedisService,
    private readonly wsAuthMiddleware: WsAuthMiddleware,
    private readonly notificationUsersService: NotificationUsersService,
  ) {}

  // Initialize WebSocket
  afterInit() {
    console.log('WebSocket initialized');
    this.server.use((socket: Socket, next) =>
      this.wsAuthMiddleware.use(socket, next),
    );
  }

  // Handle connection
  async handleConnection(socket: Socket) {
    // Increase connection number
    socket.join(socket.data.user.id);
    await this.redisService.incr(`connection_number:${socket.data.user.id}`);
  }

  // Handle disconnection
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    // get connection number
    const connectionNumber = await this.redisService.get(
      `connection_number:${socket.data.user.id}`,
    );

    // Decrease connection number
    if (parseInt(connectionNumber) === 1) {
      await this.redisService.del(`connection_number:${socket.data.user.id}`);
    } else {
      await this.redisService.decr(`connection_number:${socket.data.user.id}`);
    }
  }

  // Send notification
  async sendNotification(noti: INotiUser) {
    this.server.to(noti.user_id).emit('notification', noti);
  }

  // User read notification
  @SubscribeMessage('readNotification')
  handleReadNotification(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: object,
  ) {
    this.notificationUsersService.readNotification(
      socket.data.user.id,
      body['noti_user_id'],
    );
  }

  // Join a chat room
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomId: string,
  ) {
    socket.join(roomId);
    console.log(`User ${socket.data.user.id} joined room ${roomId}`);

    // Get message history
    const messages = await this.redisService.lRange(`chat:${roomId}`, 0, -1);

    // Send message history to client
    socket.emit(
      'messageHistory',
      messages.map((msg) => JSON.parse(msg)),
    );
  }

  // Leave a chat room
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomId: string,
  ) {
    socket.leave(roomId);
    console.log(`User ${socket.data.user.id} left room ${roomId}`);
  }
}
