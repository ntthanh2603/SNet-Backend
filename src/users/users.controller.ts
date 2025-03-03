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
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ParseFilePipeBuilder,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { createHash } from 'crypto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AfterSignUpDto } from './dto/after-signup.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { AfterDeleteDto } from './dto/after-delete.dto';
import { BeforeLoginDto } from './dto/before-login.dto';
import { AfterLoginDto } from './dto/after-login.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('avatar-user'))
  async updateUser(
    @Body() dto: UpdateUserDto,
    @User() user: IUser,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 8,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ) {
    return await this.usersService.updateUser(dto, user, file);
  }

  @Post('/before-login')
  @Public()
  @ResponseMessage('Gửi OTP thành công')
  @ApiOperation({
    summary: 'Gửi OTP về email',
  })
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  beforeLogin(@Body() dto: BeforeLoginDto) {
    return this.usersService.beforeLogin(dto);
  }

  @Public()
  @ResponseMessage('Đăng nhập tài khoản nguời dùng thành công')
  @Post('/after-login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // Giới hạn đăng nhập 3 lần trong 60s
  @ApiOperation({ summary: 'Đăng nhập tài khoản nguời dùng' })
  @ApiBody({ type: AfterLoginDto })
  afterlogin(@Body() dto: AfterLoginDto, @Req() request: Request) {
    const userAgent = request.headers['user-agent'] || '';

    const ipAddress = request.ip || '';

    const acceptLang = request.headers['accept-language'] || '';

    const rawString = `${userAgent}-${ipAddress}-${acceptLang}`;
    const deviceId = createHash('sha256').update(rawString).digest('hex'); // Mã hóa thành ID duy nhất

    const metaData: LoginMetaData = { deviceId, ipAddress };

    return this.usersService.afterlogin(dto, metaData);
  }

  @Post('/before-signup')
  @Public()
  @ResponseMessage('Gửi OTP thành công')
  @ApiOperation({
    summary: 'Gửi OTP về email',
  })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
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
