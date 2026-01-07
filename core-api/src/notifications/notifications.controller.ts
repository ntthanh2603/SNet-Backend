import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notifications.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AdminGuard } from 'src/admins/admin.guard';
import { IAdmin } from 'src/admins/admin.interface';
import { Admin, ResponseMessage } from 'src/decorator/customize';
import { CreateNotiSystemDto } from './dto/create-noti-system.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Admin: Create notification system' })
  @ResponseMessage('Create notification system successfully')
  createNotiSystem(@Admin() admin: IAdmin, @Body() dto: CreateNotiSystemDto) {
    return this.notificationService.createNotiSystem(admin, dto);
  }
}
