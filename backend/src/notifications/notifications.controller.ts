import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notifications.service';
import { Controller, Sse } from '@nestjs/common';
import { interval, map } from 'rxjs';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Sse('')
  sse() {
    return interval(1000).pipe(map(() => ({ data: { hello: 'world' } })));
  }
}
