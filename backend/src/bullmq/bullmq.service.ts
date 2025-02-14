import { Injectable, Inject } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Injectable()
export class BullMQService {
  constructor(@Inject('BULL_QUEUE') private readonly queue: Queue) {}

  // Thêm job vào hàng đợi
  async addJob(name: string, data: any, opts?: any): Promise<void> {
    await this.queue.add(name, data, opts);
  }

  // Lấy danh sách job đang chờ xử lý
  async getWaitingJobs(): Promise<any[]> {
    return this.queue.getWaiting();
  }

  // Xóa tất cả job khỏi hàng đợi
  async cleanQueue(): Promise<void> {
    await this.queue.drain();
  }

  // ❌ Xóa một job theo ID
  async removeJob(jobId: string): Promise<boolean> {
    const job = await Job.fromId(this.queue, jobId);
    if (job) {
      await job.remove();
      return true;
    }
    return false;
  }
}
