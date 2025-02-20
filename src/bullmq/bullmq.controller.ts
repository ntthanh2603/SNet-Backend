import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BullMQService } from './bullmq.service';

@ApiTags('job')
@Controller('jobs')
export class BullMQController {
  constructor(private bullMQService: BullMQService) {}

  // Endpoint thêm job vào queue thông báo
  @Post('notification')
  async addNotificationJob() {
    await this.bullMQService.push('add noti', 'datazfdf '); // Thêm job vào queue thông báo
    return 'Notification job added!';
  }

  @Post('del')
  async delNotificationJob() {
    return await this.bullMQService.pop(); // Thêm job vào queue thông báo
  }
}
