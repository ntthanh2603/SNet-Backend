import { PartialType } from '@nestjs/swagger';
import { CreateNotificationUserDto } from './create-notification-user.dto';

export class UpdateNotificationUserDto extends PartialType(CreateNotificationUserDto) {}
