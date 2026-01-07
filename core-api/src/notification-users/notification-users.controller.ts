import { Body, Controller, Delete } from '@nestjs/common';
import { NotificationUsersService } from './notification-users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IUser } from 'src/users/users.interface';
import { DeleteNotificationUserDto } from './dto/delete-noti-user.dto';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('notification-users')
@ApiTags('Notification Users')
export class NotificationUsersController {
  constructor(private readonly notiUsersService: NotificationUsersService) {}

  @Delete()
  @ApiOperation({ summary: 'Delete notification' })
  @ResponseMessage('Delete notification successfully')
  deleteNoti(@User() user: IUser, @Body() dto: DeleteNotificationUserDto) {
    return this.notiUsersService.deleteNoti(user, dto);
  }

  @Delete('all')
  @ApiOperation({ summary: 'Delete all notification' })
  @ResponseMessage('Delete all notification successfully')
  deleteAllNoti(@User() user: IUser) {
    return this.notiUsersService.deleteAllNoti(user);
  }
}
