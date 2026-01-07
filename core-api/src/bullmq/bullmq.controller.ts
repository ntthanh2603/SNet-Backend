import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BullMQService } from './bullmq.service';

@ApiTags('job')
@Controller('jobs')
export class BullMQController {
  constructor(private bullMQService: BullMQService) {}
}
