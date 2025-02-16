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
  async getAllJob(): Promise<any[]> {
    return this.queue.getWaiting();
  }

  // Xóa tất cả job khỏi hàng đợi
  async clean(): Promise<void> {
    await this.queue.drain();
  }

  // ❌ Xóa một job theo ID
  async delJobById(jobId: string): Promise<boolean> {
    const job = await Job.fromId(this.queue, jobId);
    if (job) {
      await job.remove();
      return true;
    }
    return false;
  }

  // 🆕 Lấy một job đầu tiên ra khỏi hàng đợi và xóa luôn
  async getJobAndRemote(): Promise<Job | null> {
    const jobs = await this.queue.getWaiting(); // Lấy danh sách job đang chờ xử lý
    if (jobs.length === 0) {
      return null;
    }

    const job = jobs[0]; // Lấy job đầu tiên
    await job.remove(); // Xóa job khỏi hàng đợi

    return job; // Trả về job đã xóa (nếu cần xử lý dữ liệu trước khi xóa)
  }
}
