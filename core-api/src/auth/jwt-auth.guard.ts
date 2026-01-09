import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';

/*
  - Bảo vệ các route yêu cầu xác thực JWT, cho phép bỏ qua các route được đánh dấu là public.
*/
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Luôn chạy AuthService để parse token nếu có
    const canActivate = await super.canActivate(context);
    
    // Nếu AuthGuard trả về false (do lỗi gì đó bên trong mà không throw), chúng ta vẫn cần check Public
    // Tuy nhiên AuthGuard('jwt') thường throw hoặc return true.
    return canActivate as boolean;
  }

  handleRequest(err, user, info, context) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
    ]);

    if (err || !user) {
      if (isPublic) {
        return null;
      }
      throw err || new UnauthorizedException('Token invalid');
    }
    return user;
  }
}
