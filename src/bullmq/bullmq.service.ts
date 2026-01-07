import { Injectable } from '@nestjs/common';

@Injectable()
export class BullMQService {
  constructor() {}

  // 'send-email' queue has been removed. This method is kept as a noop for other queues.
  async push(): Promise<void> {
    // No-op: queueing for email/send-otp removed.
    return Promise.resolve();
  }
}
