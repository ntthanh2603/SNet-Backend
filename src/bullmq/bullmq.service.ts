import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class BullMQService {
  constructor(@InjectQueue('send-email') private readonly queue: Queue) {}

  async push(name: string, data: any, opts?: any): Promise<void> {
    await this.queue.add(name, data, opts);
  }
}
