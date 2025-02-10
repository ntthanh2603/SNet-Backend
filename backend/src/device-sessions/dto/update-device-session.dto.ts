import { PartialType } from '@nestjs/swagger';
import { CreateDeviceSessionDto } from './create-device-session.dto';

export class UpdateDeviceSessionDto extends PartialType(CreateDeviceSessionDto) {}
