import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { DeviceSessionsService } from './device-sessions.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from 'src/users/dto/refresh-token.dto';
import { createHash } from 'crypto';

@ApiTags('DeviceSessions')
@Controller('device-sessions')
export class DeviceSessionsController {
  constructor(private readonly deviceSessionsService: DeviceSessionsService) {}

  @Post('/logout')
  @ApiOperation({ summary: 'Đăng xuất tài khoản' })
  @ResponseMessage('Đăng xuất tài khoản thành công')
  hendleLogout(@Req() request: Request, @User() user: IUser) {
    const userAgent = request.headers['user-agent'] || '';
    const ipAddress = request.ip || '';
    const acceptLang = request.headers['accept-language'] || '';
    const rawString = `${userAgent}-${ipAddress}-${acceptLang}`;
    const deviceId = createHash('sha256').update(rawString).digest('hex');

    return this.deviceSessionsService.logout(user, deviceId);
  }

  @Public()
  @ResponseMessage('Cấp lại access token thành công')
  @ApiOperation({ summary: 'Cấp lại access token' })
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
