import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notifications.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AdminGuard } from 'src/admins/admin.guard';
import { IAdmin } from 'src/admins/admin.interface';
import { Admin } from 'src/decorator/customize';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Admin: Create notification' })
  createByAdmin(@Admin() admin: IAdmin, @Body() dto: CreateNotificationDto) {
    console.log(admin);

    return this.notificationService.createByAdmin(dto);
  }
}
