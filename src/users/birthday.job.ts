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
    @InjectQueue('notificationBirthdays') private notiQueue: Queue,
  ) {}

  @Cron('0 0 * * *') // Running every day at 00h00
  // @Cron('* * * * *') // Running every minute
  async checkBirthdays() {
    console.log('Checking birthdays...');
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const birthdayUsers = await this.userRepository
      .createQueryBuilder('user')
      .where(
        'EXTRACT(DAY FROM user.birthday) = :day AND EXTRACT(MONTH FROM user.birthday) = :month',
        { day, month },
      )
      .getMany();

    if (birthdayUsers.length > 0) {
      birthdayUsers.forEach((user) => {
        this.notiQueue.add(
          'birthday',
          {
            id: user.id,
            email: user.email,
            avatar: user.avatar,
            username: user.username,
            birthday: user.birthday,
          },
          { removeOnComplete: true },
        );
      });
    }
    return;
  }
}
