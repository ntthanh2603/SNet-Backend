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
  ParseFilePipeBuilder,
  UploadedFile,
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

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/account')
  @ResponseMessage('Get account from header successfully')
  @ApiOperation({ summary: 'Get account' })
  handleGetAccount(@User() user: IUser) {
    return user;
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Find user by ID successfully')
  @ApiOperation({ summary: 'Find user by ID' })
  async findUserById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    const user = await this.usersService.findUserById(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    return result;
  }

  @Patch('/update')
  @ResponseMessage('Update profile user seccessfully')
  @ApiOperation({ summary: 'Update profile user' })
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

  @Post('/otp/send/login')
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
  @Post('/otp/verify/login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Login account' })
  @ApiBody({ type: AfterLoginDto })
  afterlogin(@Body() dto: AfterLoginDto, @Fingerprint() fp: IFingerprint) {
    const metaData: LoginMetaData = {
      deviceId: fp['id'],
      ipAddress: fp['ipAddress']['value'],
    };
    return this.usersService.afterlogin(dto, metaData);
  }

  @Post('/otp/send/signup')
  @Public()
  @ResponseMessage('Send OTP seccessfully')
  @ApiOperation({
    summary: 'Send email to sign up',
  })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  beforeSignUp(@Body() dto: SendOtpDto) {
    return this.usersService.beforeSignUp(dto.email, dto.username);
  }

  @Post('/otp/verify/signup')
  @Public()
  @ResponseMessage('Create user successfully')
  @ApiOperation({
    summary: 'Check OTP on email to sign up',
  })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  afterSignUp(@Body() dto: AfterSignUpDto) {
    return this.usersService.afterSignUp(dto);
  }

  @Post('/otp/send/delete')
  @ResponseMessage('Send OTP seccessfully')
  @ApiOperation({
    summary: 'Gửi OTP về email',
  })
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  beforeDelete(@User() user: IUser) {
    return this.usersService.beforeDelete(user);
  }

  @Delete('/otp/verify/delete')
  @ResponseMessage('Delete account seccessfully')
  @ApiOperation({ summary: 'Delete account' })
  afterDelete(@User() user: IUser, @Body() dto: AfterDeleteDto) {
    console.log(user);

    return this.usersService.afterDelete(user.id, dto.otp);
  }
}

export interface LoginMetaData {
  deviceId: string;
  ipAddress: string;
}
