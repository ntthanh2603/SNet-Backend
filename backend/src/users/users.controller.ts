import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  BadRequestException,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { RegisterUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { createHash } from 'crypto';
import { DeviceSessionsService } from 'src/device-sessions/device-sessions.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly deviceSessionsService: DeviceSessionsService,
  ) {}

  @Get('/account')
  @ResponseMessage('Lấy thông tin tài khoản')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản từ header' })
  handleGetAccount(@User() user: IUser) {
    return user;
  }

  @Public()
  @Get(':id')
  @SkipThrottle() // Không giới hạn reqest
  @ResponseMessage('Tìm kiếm người dùng bằng ID')
  @ApiOperation({ summary: 'Tìm kiếm người dùng bằng ID' })
  async findUserById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    const user = await this.usersService.findUserById(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    return result;
  }

  @Patch()
  @ResponseMessage('Cập nhật người dùng')
  @ApiOperation({ summary: 'Cập nhật người dùng' })
  updateUser(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.updateProfile(updateUserDto, user);
  }

  @Public()
  @ResponseMessage('Tạo tài khoản người dùng thành công')
  @Post('/register')
  @ApiOperation({ summary: 'Tạo tài khoản' })
  @ApiBody({ type: RegisterUserDto })
  handleRegister(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @Public()
  @ResponseMessage('Đăng nhập tài khoản nguời dùng thành công')
  @Post('/login')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // Giới hạn đăng nhập 3 lần trong 60s
  @ApiOperation({ summary: 'Đăng nhập tài khoản nguời dùng' })
  @ApiBody({ type: LoginUserDto })
  login(@Body() dto: LoginUserDto, @Req() request: Request) {
    const userAgent = request.headers['user-agent'] || '';

    const ipAddress = request.ip || '';

    const acceptLang = request.headers['accept-language'] || '';

    const rawString = `${userAgent}-${ipAddress}-${acceptLang}`;
    const deviceId = createHash('sha256').update(rawString).digest('hex'); // Mã hóa thành ID duy nhất

    const metaData: LoginMetaData = { deviceId, ipAddress };

    return this.usersService.login(dto, metaData);
  }

  @Delete()
  @ResponseMessage('Xóa tài khoản người dùng thành công')
  @ApiOperation({ summary: 'Xóa tài khoản người dùng' })
  deleteUser(@User() user: IUser) {
    return this.usersService.deleteUser(user.id);
  }
}

export interface LoginMetaData {
  deviceId: string;
  ipAddress: string;
}
