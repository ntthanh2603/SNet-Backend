import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  BadRequestException,
  Post,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UsersService } from './users.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { RegisterUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { createHash } from 'crypto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/account')
  @ResponseMessage('Get user information')
  handleGetAccount(@User() user: IUser) {
    return user;
  }

  @Public()
  @ResponseMessage('Get user by refresh token')
  @Get('/refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];

    if (!refreshToken) {
      throw new BadRequestException('Refresh token is missing');
    }

    const userAgent = request.headers['user-agent'] || '';

    const ipAddress = request.ip || '';

    const acceptLang = request.headers['accept-language'] || '';

    const rawString = `${userAgent}-${ipAddress}-${acceptLang}`;
    const deviceId = createHash('sha256').update(rawString).digest('hex');

    return this.usersService.processNewToken(
      refreshToken,
      response,
      deviceId,
      ipAddress,
    );
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
  login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
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
