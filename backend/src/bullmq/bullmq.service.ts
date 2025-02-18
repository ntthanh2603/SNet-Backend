import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Injectable()
export class BullMQService {
  constructor(@InjectQueue('notifications') private readonly queue: Queue) {}

  async addJob(name: string, data: any, opts?: any): Promise<void> {
    await this.queue.add(name, data, opts);
  }

  async delJobById(jobId: string): Promise<boolean> {
    const job = await Job.fromId(this.queue, jobId);
    if (job) {
      await job.remove();
      return true;
    }
    return false;
  }

  async getJobAndRemove(): Promise<Job | null> {
    const jobs = await this.queue.getJobs();
    const length = jobs.length;
    if (length === 0) {
      return null;
    }

    const job = jobs[length - 1];
    await job.remove();

    return job;
  }

  async getAllJob(): Promise<Job[]> {
    const jobs = await this.queue.getJobs();
    return jobs;
  }
}
