import { MailerService } from '@nest-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('send-email')
export class SendEmailProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<unknown>): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to: job.data['email'],
        subject: 'Mạng xã hội SNet',
        template: `./${job.data['template']}`,
        context: {
          username: job.data['username'],
          otp: job.data['otp'],
        },
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
