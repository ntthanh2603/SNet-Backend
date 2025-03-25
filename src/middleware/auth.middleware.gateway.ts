// middleware/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddlewareGateway implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(socket: Socket, next: (err?: any) => void) {
    const authToken: any = socket.handshake.headers.authorization;

    if (!authToken) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      // Verify token
      const user = await this.authService.verify(authToken);
      // Attach user to socket
      socket.data.user = user;

      next();
    } catch {
      next(new Error('Authentication error: Invalid token'));
    }
  }
}
