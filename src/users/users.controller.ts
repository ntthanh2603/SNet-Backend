import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  BadRequestException,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { Throttle } from '@nestjs/throttler';
import { AfterSignUpDto } from './dto/after-signup.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { AfterDeleteDto } from './dto/after-delete.dto';
import { BeforeLoginDto } from './dto/before-login.dto';
import { AfterLoginDto } from './dto/after-login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Fingerprint, IFingerprint } from 'nestjs-fingerprint';
import { Response } from 'express';
import { AfterForgotPasswordDto } from './dto/after-forgot-password';
import { GoogleAuthGuard } from 'src/auth/google-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/account')
  @ResponseMessage('Get account from header successfully')
  @ApiOperation({ summary: 'Get account' })
  getAccount(@User() user: IUser) {
    return this.usersService.getAccount(user);
  }

  @Get(':user_id')
  @ResponseMessage('Find user by ID successfully')
  @ApiOperation({ summary: 'Find user by ID' })
  async getProfile(@Param('user_id') user_id: string, @User() user: IUser) {
    if (!isUUID(user_id)) {
      throw new BadRequestException(`Invalid ID format: ${user_id}`);
    }
    const userResult = await this.usersService.findUserById(user_id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = userResult;

    const privacySeeProfile = await this.usersService.privacySeeProfile(
      user.id,
      user_id,
    );

    if (!privacySeeProfile) {
      const { id, email, avatar, username, privacy } = userResult;
      return {
        id,
        email,
        avatar,
        username,
        privacy,
      };
    }
    return result;
  }

  @Patch('/profile')
  @ResponseMessage('Update profile user seccessfully')
  @ApiOperation({ summary: 'Update profile user' })
  @UseInterceptors(FileInterceptor('avatar-user'))
  async updateUser(
    @Body() dto: UpdateUserDto,
    @User() user: IUser,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return await this.usersService.updateUser(dto, user, file);
  }

  @Post('/send-otp/login')
  @Public()
  @ResponseMessage('Send OTP seccessfully')
  @ApiOperation({
    summary: 'Send email to login',
  })
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  beforeLogin(@Body() dto: BeforeLoginDto) {
    return this.usersService.beforeLogin(dto);
  }

  @Public()
  @ResponseMessage('Login account successfully')
  @Post('/verify-otp/login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Login account' })
  @ApiBody({ type: AfterLoginDto })
  afterlogin(
    @Body() dto: AfterLoginDto,
    @Fingerprint() fp: IFingerprint,
    @Res({ passthrough: true }) response: Response,
  ) {
    const metaData: LoginMetaData = {
      deviceId: fp['id'],
      ipAddress: fp['ipAddress']['value'],
    };
    return this.usersService.afterlogin(dto, metaData, response);
  }

  @Post('/send-otp/signup')
  @Public()
  @ResponseMessage('Send OTP seccessfully')
  @ApiOperation({
    summary: 'Send email to sign up',
  })
  // @Throttle({ default: { limit: 10, ttl: 60000 } })
  beforeSignUp(@Body() dto: SendOtpDto) {
    return this.usersService.beforeSignUp(dto.email, dto.username);
  }

  @Post('/verify-otp/signup')
  @Public()
  @ResponseMessage('Create user successfully')
  @ApiOperation({
    summary: 'Check OTP on email to sign up',
  })
  // @Throttle({ default: { limit: 5, ttl: 60000 } })
  afterSignUp(@Body() dto: AfterSignUpDto) {
    return this.usersService.afterSignUp(dto);
  }

  @Post('/send-otp/forgot-password')
  @Public()
  @ResponseMessage('Send OTP seccessfully')
  @ApiOperation({
    summary: 'Send otp to forgot password',
  })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  boforeForgotPassword(@Body() dto: SendOtpDto) {
    return this.usersService.beforeForgotPassword(dto);
  }

  @Post('/verify-otp/forgot-password')
  @Public()
  @ResponseMessage('Update password seccessfully')
  @ApiOperation({
    summary: 'Authenticate otp to update password',
  })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  afterForgotPassword(@Body() dto: AfterForgotPasswordDto) {
    return this.usersService.afterForgotPassword(dto);
  }

  @Post('/send-otp/delete')
  @ResponseMessage('Send OTP seccessfully')
  @ApiOperation({
    summary: 'Gửi OTP về email',
  })
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  beforeDelete(@User() user: IUser) {
    return this.usersService.beforeDelete(user);
  }

  @Delete('/verify-otp/delete')
  @ResponseMessage('Delete account seccessfully')
  @ApiOperation({ summary: 'Delete account' })
  afterDelete(@User() user: IUser, @Body() dto: AfterDeleteDto) {
    console.log(user);

    return this.usersService.afterDelete(user.id, dto.otp);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googlelogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleCallback(@Req() req, @Res() res) {
    res.redirect('http://localhost:5173?accessToken=123');
  }
}

export interface LoginMetaData {
  deviceId: string;
  ipAddress: string;
}

// req.user CreateAccountWithGoogleDto {
//   email: 'tuanthanh2kk4@gmail.com',
//   username: 'Thành Tuấn',
//   avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJIJ43GB6PDJpco42Kdp__TcUrIfbwcWiY_xlMugg2BvcORFBo=s96-c',
//   password: '',
//   bio: null,
//   website: null,
//   birthday: null,
//   gender: null,
//   address: null,
//   last_active: null,
//   updated_at: 2025-05-13T01:07:00.849Z,
//   id: '6efe04b9-f304-41a9-bd6e-8ebe061bb513',
//   privacy: 'public',
//   user_category: 'casualuser',
//   company: [],
//   education: [],
//   role: 'user',
//   created_at: 2025-05-13T01:07:00.849Z
// }
