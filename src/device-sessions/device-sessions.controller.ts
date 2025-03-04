import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeviceSessionsService } from './device-sessions.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from 'src/users/dto/refresh-token.dto';
import { Fingerprint, IFingerprint } from 'nestjs-fingerprint';

@ApiTags('DeviceSessions')
@Controller('device-sessions')
export class DeviceSessionsController {
  constructor(private readonly deviceSessionsService: DeviceSessionsService) {}

  @Post('/logout')
  @ApiOperation({ summary: 'Đăng xuất tài khoản' })
  @ResponseMessage('Đăng xuất tài khoản thành công')
  hendleLogout(@Fingerprint() fp: IFingerprint, @User() user: IUser) {
    return this.deviceSessionsService.logout(user, fp['id']);
  }

  @Public()
  @ResponseMessage('Cấp lại access token thành công')
  @ApiOperation({ summary: 'Cấp lại access token' })
  @Get('/refresh-token')
  reAuth(@Fingerprint() fp: IFingerprint, @Body() dto: RefreshTokenDto) {
    return this.deviceSessionsService.reAuth(dto.refreshToken, fp['id']);
  }
}
