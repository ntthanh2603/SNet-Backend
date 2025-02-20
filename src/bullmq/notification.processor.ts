import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  async process(job: Job): Promise<any> {
    console.log('Processing Notification Job:', job.id, job.data);
  }
}
