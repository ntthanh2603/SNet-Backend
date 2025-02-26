import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notifications.service';
import { Controller, Sse } from '@nestjs/common';
import { interval, map } from 'rxjs';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Gửi thông báo qua SSE' })
  @Sse('sse')
  sse() {
    return interval(1000).pipe(map(() => ({ data: { hello: 'world' } })));
  }
}
