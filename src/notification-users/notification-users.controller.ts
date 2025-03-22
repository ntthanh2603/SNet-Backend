import { Controller, Sse } from '@nestjs/common';
import { NotificationUsersService } from './notification-users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { interval, map } from 'rxjs';

@Controller('notification-users')
@ApiTags('Notification Users')
export class NotificationUsersController {
  constructor(
    private readonly notificationUsersService: NotificationUsersService,
  ) {}

  @ApiOperation({ summary: 'Gửi thông báo qua SSE' })
  @Sse('sse')
  sse() {
    return interval(1000).pipe(map(() => ({ data: { hello: 'world' } })));
  }
}
