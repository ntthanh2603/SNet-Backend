import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('notificationBirthdays')
export class NotiBirthdayProcessor extends WorkerHost {
  constructor() {
    super();
  }

  async process(job: Job<unknown>): Promise<any> {
    try {
      console.log('data', job.data);
      return job.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
