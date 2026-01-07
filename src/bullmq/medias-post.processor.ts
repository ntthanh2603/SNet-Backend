import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('create-posts')
export class MediasPostsProcessor extends WorkerHost {
  constructor() {
    super();
  }

  async process(job: Job<unknown>): Promise<any> {
    try {
      console.log('data create post', job.data);
      return job.data;
    } catch (error) {
      console.error('Error processing create-posts job:', error);
      throw error;
    }
  }
}
