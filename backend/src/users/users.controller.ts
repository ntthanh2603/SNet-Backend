import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';
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
    return this.usersService.processNewToken(refreshToken, response);
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
  @UseInterceptors(FileInterceptor('avatar-user'))
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1000 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.usersService.updateProfile(updateUserDto, user, file);
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
  handleLogin(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent'] || '';

    const ipAddress = req.ip || '';

    const acceptLang = req.headers['accept-language'] || '';

    const rawString = `${userAgent}-${ipAddress}-${acceptLang}`;
    const deviceId = createHash('sha256').update(rawString).digest('hex'); // Mã hóa thành ID duy nhất

    return this.usersService.login(dto, response, deviceId, ipAddress);
  }

  @Delete()
  @ResponseMessage('Delete User')
  deleteUser(@User() user: IUser) {
    return this.usersService.deleteUser(user.id);
  }
}
