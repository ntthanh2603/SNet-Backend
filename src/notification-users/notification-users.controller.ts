import { Controller } from '@nestjs/common';
import { NotificationUsersService } from './notification-users.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('notification-users')
@ApiTags('Notification Users')
export class NotificationUsersController {
  constructor(private readonly notiUsersService: NotificationUsersService) {}
}
