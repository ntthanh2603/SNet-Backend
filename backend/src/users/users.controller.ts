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
import { LoginUserDto } from './dto/login-user.dto';
import { createHash } from 'crypto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AfterSignUpDto } from './dto/after-signup.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { AfterDeleteDto } from './dto/after-delete.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Post('/before-signup')
  @Public()
  @ResponseMessage('Gửi OTP thành công')
  @ApiOperation({
    summary: 'Gửi OTP về email',
  })
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  beforeSignUp(@Body() dto: SendOtpDto) {
    return this.usersService.beforeSignUp(dto.email, dto.username);
  }

  @Post('/after-signup')
  @Public()
  @ResponseMessage('Tại tài khoản thành công')
  @ApiOperation({
    summary: 'Kiểm tra OTP có hợp lệ không để đăng ký tài khoản',
  })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  afterSignUp(@Body() dto: AfterSignUpDto) {
    return this.usersService.afterSignUp(dto);
  }

  @Post('/before-delete')
  @ResponseMessage('Gửi OTP thành công')
  @ApiOperation({
    summary: 'Gửi OTP về email',
  })
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  beforeDelete(@User() user: IUser) {
    return this.usersService.beforeDelete(user);
  }

  @Delete('/after-delete')
  @ResponseMessage('Xóa tài khoản người dùng thành công')
  @ApiOperation({ summary: 'Xóa tài khoản người dùng' })
  afterDelete(@User() user: IUser, @Body() dto: AfterDeleteDto) {
    console.log(user);

    return this.usersService.afterDelete(user.id, dto.otp);
  }
}

export interface LoginMetaData {
  deviceId: string;
  ipAddress: string;
}
