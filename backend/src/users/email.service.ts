import { MailerService } from '@nest-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async SendOtpSignUp(
    email: string,
    username: string,
    otp: string,
  ): Promise<boolean> {
    const response = await this.mailerService.sendMail({
      to: email,
      subject: 'Mạng xã hội SNet - Xác nhận đăng ký tài khoản',
      template: './otp-signup-account', // Tên template OTP
      context: {
        username: username,
        otp: otp.toString(),
      },
    });
    return response.accepted.length > 0 ? true : false;
  }

  async SendOtpDelete(
    email: string,
    username: string,
    otp: string,
  ): Promise<boolean> {
    const response = await this.mailerService.sendMail({
      to: email,
      subject: 'Mạng xã hội SNet - Xác nhận xóa tài khoản',
      template: './otp-delete-account', // Tên template OTP
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
      subject: 'Mạng xã hội SNet - Lời cảm ơn',
      template: './signup-success', // Tên template OTP
      context: {
        username: username,
      },
    });
  }
}
