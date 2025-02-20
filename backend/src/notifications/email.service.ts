import { MailerService } from '@nest-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async SendOTP(
    email: string,
    username: string,
    otp: string,
    template: string,
  ): Promise<boolean> {
    const response = await this.mailerService.sendMail({
      to: email,
      subject: 'Mạng xã hội SNet - Xác nhận xóa tài khoản',
      template: `./${template}`, // Tên template OTP
      context: {
        username: username,
        otp: otp.toString(),
      },
    });
    return response.accepted.length > 0 ? true : false;
  }

  async sendSignUpSuccess(email: string, username: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Mạng xã hội SNet - Chào mừng bạn đến SNet',
      template: './signup-success', // Tên template OTP
      context: {
        username: username,
      },
    });
  }
}
