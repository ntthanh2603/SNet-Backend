import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { DeviceSessionsService } from './device-sessions.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from 'src/users/dto/refresh-token.dto';
import { createHash } from 'crypto';

@ApiTags('DeviceSessions')
@Controller('device-sessions')
export class DeviceSessionsController {
  constructor(private readonly deviceSessionsService: DeviceSessionsService) {}

  @Post('/logout')
  @ResponseMessage('Logout user')
  hendleLogout(@Req() request: Request, @User() user: IUser) {
    const userAgent = request.headers['user-agent'] || '';
    const ipAddress = request.ip || '';
    const acceptLang = request.headers['accept-language'] || '';
    const rawString = `${userAgent}-${ipAddress}-${acceptLang}`;
    const deviceId = createHash('sha256').update(rawString).digest('hex');

    return this.deviceSessionsService.logout(user, deviceId);
  }

  @Public()
  @ResponseMessage('Get user by refresh token')
  @Get('/refresh-token')
  reAuth(@Req() request: Request, @Body() dto: RefreshTokenDto) {
    const userAgent = request.headers['user-agent'] || '';
    const ipAddress = request.ip || '';
    const acceptLang = request.headers['accept-language'] || '';
    const rawString = `${userAgent}-${ipAddress}-${acceptLang}`;
    const deviceId = createHash('sha256').update(rawString).digest('hex');

    return this.deviceSessionsService.reAuth(dto.refreshToken, deviceId);
  }
}
