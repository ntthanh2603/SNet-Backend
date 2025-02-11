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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { RegisterUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { createHash } from 'crypto';
import { DeviceSessionsService } from 'src/device-sessions/device-sessions.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly deviceSessionsService: DeviceSessionsService,
  ) {}

  @Get('/account')
  @ResponseMessage('Get user information')
  handleGetAccount(@User() user: IUser) {
    return user;
  }

  @Public()
  @Get(':id')
  @ResponseMessage('User by user_id')
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
  @ResponseMessage('Update User')
  updateUser(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.updateProfile(updateUserDto, user);
  }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  @ApiBody({ type: RegisterUserDto })
  handleRegister(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @Public()
  @ResponseMessage('User login')
  @Post('/login')
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
  @ResponseMessage('Delete User')
  deleteUser(@User() user: IUser) {
    return this.usersService.deleteUser(user.id);
  }
}

export interface LoginMetaData {
  deviceId: string;
  ipAddress: string;
}
