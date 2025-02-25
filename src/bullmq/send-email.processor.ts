import { MailerService } from '@nest-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('sendEmail')
export class SendEmailProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super(); // Quan trọng: Gọi super() để kế thừa WorkerHost
  }

  async process(job: Job<unknown>): Promise<any> {
    try {
      console.log('send mail', job.data);
      await this.mailerService.sendMail({
        to: job.data['email'],
        subject: 'Mạng xã hội SNet',
        template: `${job.data['template']}`,
        context: {
          username: job.data['username'],
          otp: job.data['otp'].toString(),
        },
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

// const response = await this.mailerService.sendMail({
//   to: email,
//   subject: 'Mạng xã hội SNet',
//   template: `./${template}`, // Tên template OTP
//   context: {
//     username: username,
//     otp: otp.toString(),
//   },
// });
