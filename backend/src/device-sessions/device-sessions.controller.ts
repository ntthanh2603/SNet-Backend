import { Controller, Post, Res } from '@nestjs/common';
import { DeviceSessionsService } from './device-sessions.service';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('DeviceSessions')
@Controller('device-sessions')
export class DeviceSessionsController {
  constructor(private readonly deviceSessionsService: DeviceSessionsService) {}

  @Post('/logout')
  @ResponseMessage('Logout user')
  hendleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.deviceSessionsService.logout(response, user);
  }
}
