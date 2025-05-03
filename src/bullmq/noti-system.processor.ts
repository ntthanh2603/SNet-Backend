import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { GatewayGateway } from 'src/gateway/gategate.gateway';
import { NotificationUser } from 'src/notification-users/entities/notification-user.entity';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Processor('noti-system')
export class NotiSystemProcessor extends WorkerHost {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(NotificationUser)
    private readonly notiUserRepository: Repository<NotificationUser>,
    private readonly gatewayGateway: GatewayGateway,
    private readonly redisService: RedisService,
  ) {
    super();
  }

  /**
   * Processes a job to send system notifications to all users.
   *
   * This function retrieves all users and creates a new `NotificationUser` entry
   * for each user with the provided notification data. After saving the notification
   * entry, it sends the notification to the user using the `GatewayGateway`.
   *
   * @param job - The job containing data attributes:
   *   - `notification_id`: The ID of the notification to be sent.
   *   - `title`: The title of the notification message.
   *   - `message`: The content of the notification message.
   *
   * @throws Will log and rethrow any errors encountered during processing.
   */
  async process(job: Job<unknown>): Promise<any> {
    try {
      const notification_id: string = job.data['notification_id'];

      const users = await this.usersRepository.find({
        select: ['id'],
      });
      users.map(async (user) => {
        const notificationUser = new NotificationUser();
        notificationUser.id = uuidv4();
        notificationUser.notification_id = notification_id;
        notificationUser.user_id = user.id;
        notificationUser.is_sent = false;

        // Check user status
        const userStatus = await this.redisService.get(
          `connection_number:${user.id}`,
        );

        if (!userStatus || parseInt(userStatus) <= 0) {
          notificationUser.is_sent = false;
        } else {
          notificationUser.is_sent = true;

          // Send notification use socket
          this.gatewayGateway.sendNotification({
            user_id: user.id,
            noti_user_id: notificationUser.id,
            notification_type: 'system',
            title: job.data['title'],
            message: job.data['message'],
          });
        }
        // Save notification in database
        await this.notiUserRepository.save(notificationUser);
      });

      return;
    } catch (error) {
      throw error;
    }
  }
}
