import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Interceptor
export const RESPONSE_MESSAGE = 'response_message';
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// export const User = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     // Xử lý WebSocket hoặc HTTP Request
//     if (ctx.getType() === 'http') {
//       return ctx.switchToHttp().getRequest().user;
//     } else if (ctx.getType() === 'ws') {
//       console.log(ctx.switchToWs().getClient().handshake.headers);
//       return ctx.switchToWs().getClient().handshake.headers['user-id']; // Lấy userId từ header WebSocket
//     }
//   },
// );
