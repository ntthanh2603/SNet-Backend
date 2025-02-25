import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class BirthdayJob {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectQueue('sendEmail') private sendMail: Queue,
  ) {}
  @Cron('0 0 * * *') // Chạy lúc 00:00 mỗi ngày
  async checkBirthdays() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const birthdayUsers = await this.userRepository
      .createQueryBuilder('user')
      .where('DAY(user.birthday) = :day AND MONTH(user.birthday) = :month', {
        day,
        month,
      })
      .getMany();
    if (birthdayUsers.length > 0) {
      birthdayUsers.forEach((user) => {
        this.sendMail.add('sendEmail', {}, {});
      });
    }
  }
}
