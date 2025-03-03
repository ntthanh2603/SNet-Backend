import { Controller } from '@nestjs/common';
import { NotificationUsersService } from './notification-users.service';

@Controller('notification-users')
export class NotificationUsersController {
  constructor(
    private readonly notificationUsersService: NotificationUsersService,
  ) {}
}
