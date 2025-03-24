import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor() {}

  afterInit(socket: Socket) {}

  handleConnection(socket: Socket) {
    const authHeader = socket.handshake.headers['authorization'];
    if (authHeader) {
    } else {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    console.log('Client disconnected');
  }
}
