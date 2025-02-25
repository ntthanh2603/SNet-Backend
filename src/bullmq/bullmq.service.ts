import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class BullMQService {
  constructor(@InjectQueue('sendEmail') private readonly queue: Queue) {}

  async push(name: string, data: any, opts?: any): Promise<void> {
    await this.queue.add(name, data, opts);
  }

  // async pop(): Promise<Job | null> {
  //   const jobs = await this.queue.getJobs();
  //   const length = jobs.length;
  //   if (length === 0) {
  //     return null;
  //   }

  //   const job = jobs[length - 1];
  //   await job.remove();

  //   return job;
  // }

  // async getAllJob(): Promise<Job[]> {
  //   const jobs = await this.queue.getJobs();
  //   return jobs;
  // }
}
