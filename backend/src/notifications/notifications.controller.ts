import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notifications.service';
import { Controller } from '@nestjs/common';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
}
