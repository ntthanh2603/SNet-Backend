import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NotificationType } from 'src/helper/notification.enum';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '123123123' })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @MinLength(1)
  @ApiProperty({ example: 'Thông báo hệ thống' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(1)
  @ApiProperty({ example: 'Hệ thống quá tốt' })
  message: string;

  @IsEnum(NotificationType)
  @IsNotEmpty()
  @ApiProperty()
  notification_type: NotificationType;
}
