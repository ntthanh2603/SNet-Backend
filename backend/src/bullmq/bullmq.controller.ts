import { Controller, Get, Post } from '@nestjs/common';
import { BullMQService } from './bullmq.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('BullMQ')
@Controller('bullmq')
export class BullMQController {
  constructor(private readonly bullMQService: BullMQService) {}

  @Post('add-job')
  async addJob() {
    await this.bullMQService.addJob('notification', {
      message: 'Hello BullMQ!',
    });
    return 'Job added!';
  }

  @Get('waiting-jobs')
  async getWaitingJobs() {
    return await this.bullMQService.getAllJob();
  }

  @Post()
  async deleteJob() {
    const deleted = await this.bullMQService.getJobAndRemote();
    return deleted;
  }
}
