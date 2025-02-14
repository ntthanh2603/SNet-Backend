import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('job-queue')
export class BullMQProcessor {
  async handleJob(job: Job<any>) {
    console.log(`Processing job ${job.id}:`, job.data);
    // Thực hiện công việc ở đây...
  }
}
