import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { LoggerService } from 'src/logger/logger.service';
import { NotificationUser } from 'src/notification-users/entities/notification-user.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Processor('noti-system')
export class NotiSystemProcessor extends WorkerHost {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(NotificationUser)
    private readonly notiUserRepository: Repository<NotificationUser>,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async process(job: Job<unknown>): Promise<any> {
    try {
      const notification_id: string = job.data['notification_id'];

      const users = await this.usersRepository.find({
        select: ['id'],
      });
      users.map(async (user) => {
        await this.notiUserRepository.save({
          user_id: user.id,
          notification_id: notification_id,
        });
      });
      return;
    } catch (error) {
      this.logger.error({
        message: 'Error noti system',
        metadata: {
          data: job.data,
        },
        trace: error.stack,
      });
      throw error;
    }
  }
}
