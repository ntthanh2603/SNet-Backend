import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BirthdayJob {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  @Cron('0 0 * * *') // Chạy lúc 00:00 mỗi ngày
  async checkBirthdays() {
    console.log('🎉 Running Birthday Job at 00:00');
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
        this.notificationQueue.addBirthdayNotification(user.id, user.username);
      });
    }
  }
}
