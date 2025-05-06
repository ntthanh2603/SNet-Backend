import { DeviceSessionsService } from './../device-sessions/device-sessions.service';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { IUser } from './users.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { LoginMetaData } from './users.controller';
import { randomInt } from 'crypto';
import { AfterSignUpDto } from './dto/after-signup.dto';
import { ConfigService } from '@nestjs/config';
import { BeforeLoginDto } from './dto/before-login.dto';
import { AfterLoginDto } from './dto/after-login.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import * as fs from 'fs';
import { UserSearchService } from 'src/search-engine/user-search.service';
import { PrivacyType } from 'src/helper/privacy.enum';
import { RelationsService } from 'src/relations/relations.service';
import { RelationType } from 'src/helper/relation.enum';
import { Response } from 'express';
import { SendOtpDto } from './dto/send-otp.dto';
import { AfterForgotPasswordDto } from './dto/after-forgot-password';
import { format } from 'date-fns';
import logger from 'src/logger';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private redisService: RedisService,
    private diviceSessionsService: DeviceSessionsService,
    private readonly configService: ConfigService,
    @InjectQueue('send-email')
    private sendEmail: Queue,
    private readonly userSearchService: UserSearchService,
    @Inject(forwardRef(() => RelationsService))
    private readonly relationsService: RelationsService,
  ) {}

  async getHashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  isValidPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  /**
   * Find user by email
   * @param email user's email
   * @returns User entity if found, otherwise null
   */
  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  /**
   * Check if a user is allowed to see another user's profile based on
   * the privacy setting of the user being viewed.
   * @param user_id_see The ID of the user performing the action.
   * @param user_id The ID of the user being viewed.
   * @returns A boolean indicating whether the view is allowed.
   */
  async privacySeeProfile(user_id_see: string, user_id: string) {
    const privacy = (await this.findUserById(user_id)).privacy;
    switch (true) {
      case privacy === PrivacyType.PRIVATE:
        return false;
      case privacy === PrivacyType.PUBLIC:
        return true;
      case privacy === PrivacyType.FRIEND:
        const relation = await this.relationsService.getRelation(
          user_id_see,
          user_id,
        );
        if (relation === RelationType.FRIEND) {
          return true;
        } else {
          return false;
        }
    }
    return false;
  }

  /**
   * @description Send OTP to email when sign up
   * @param email
   * @param username
   * @returns
   */
  async beforeSignUp(email: string, username: string) {
    const userDb = await this.usersRepository.findOneBy({ email });

    if (userDb) {
      throw new BadRequestException(`Email ${email} has existed.`);
    }

    const otp = randomInt(100000, 999999).toString();

    await this.sendEmail.add(
      'sendOTP',
      {
        email: email,
        username: username,
        otp: otp,
        template: 'otp-signup-account',
      },
      { removeOnComplete: true },
    );

    await this.redisService.set(
      `otp-code:${email}`,
      otp,
      this.configService.get('TIME_OTP'),
    );

    return;
  }

  /**
   * @description Sends an OTP to the user's email for login verification.
   * @param dto - Data transfer object containing user's email and password.
   * @returns void
   * @throws BadRequestException if the email or password is invalid.
   */
  async beforeLogin(dto: BeforeLoginDto) {
    const userDb = await this.validateUser(dto.email, dto.password);

    const otp = randomInt(100000, 999999).toString();

    await this.sendEmail.add(
      'sendOTP',
      {
        email: userDb.email,
        username: userDb.username,
        otp: otp,
        template: 'otp-login-account',
      },
      { removeOnComplete: true },
    );

    await this.redisService.set(
      `otp-code:${userDb.email}`,
      otp,
      this.configService.get('TIME_OTP'),
    );
    return;
  }

  /**
   * @description Sends an OTP to the user's email for account deletion.
   * @param user - The user to delete.
   * @returns void
   * @throws NotFoundException if the user is not found.
   */
  async beforeDelete(user: IUser) {
    const userDb = await this.findUserById(user.id);

    const otp = randomInt(100000, 999999).toString();

    await this.sendEmail.add(
      'sendOTP',
      {
        email: userDb.email,
        username: userDb.username,
        otp: otp,
        template: 'otp-delete-account',
      },
      { removeOnComplete: true },
    );

    await this.redisService.set(
      `otp-code:${userDb.email}`,
      otp,
      this.configService.get('TIME_OTP'),
    );
    return;
  }

  /**
   * @description Handles the login process.
   * @param dto - The login payload.
   * @param metaData - The login metadata.
   * @param response - The response object.
   * @returns A promise containing the access token.
   * @throws BadRequestException if OTP code is incorrect or expired.
   */
  async afterlogin(
    dto: AfterLoginDto,
    metaData: LoginMetaData,
    response: Response,
  ) {
    const user = await this.validateUser(dto.email, dto.password);

    const otp = await this.redisService.get(`otp-code:${dto.email}`);

    if (otp !== dto.otp)
      throw new BadRequestException('OTP code is incorrect or expired');

    await this.redisService.del(`otp-code:${dto.email}`);

    const handleLogin = await this.diviceSessionsService.handleLogin(
      user.id,
      metaData,
      user.role,
    );
    response.cookie('refreshToken', handleLogin.refreshToken, {
      httpOnly: true,
      maxAge: handleLogin.expiredAt.getTime(),
    });
    return { accessToken: handleLogin.accessToken };
  }

  /**
   * Validates a user's credentials.
   *
   * @param email - The email of the user to validate.
   * @param password - The password of the user to validate.
   * @returns The user object if validation is successful.
   * @throws UnauthorizedException if the user is not found or the password is incorrect.
   */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !this.isValidPassword(password, user.password)) {
      throw new UnauthorizedException('Info is incorrect');
    }
    return user;
  }

  async afterSignUp(dto: AfterSignUpDto) {
    try {
      const otp = await this.redisService.get(`otp-code:${dto.email}`);

      if (otp !== dto.otp)
        throw new BadRequestException('OTP code is incorrect or expired');

      const hashPassword = await this.getHashPassword(dto.password);

      const newUser = {
        email: dto.email,
        password: hashPassword,
        avatar: dto?.avatar,
        username: dto.username,
        bio: dto?.bio,
        website: dto?.website,
        birthday: dto?.birthday,
        gender: dto?.gender,
        address: dto?.address,
        privacy: PrivacyType.PUBLIC,
      };

      await this.usersRepository.save(newUser);

      await this.sendEmail.add(
        'sendOTP',
        {
          email: dto.email,
          username: dto.username,
          template: 'signup-success',
        },
        { removeOnComplete: true },
      );

      await this.redisService.del(`otp-code:${dto.email}`);

      return { message: 'sign up successfully' };
    } catch (err) {
      logger.error(
        `Error in afterSignUp: ${err.message} - ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
        err.stack,
      );
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException('Error when sign up');
    }
  }

  /**
   * @description Handles the deletion of a user account.
   * @param id - The id of the user to delete.
   * @param otp - The OTP code sent to the user's email.
   * @returns The result of the deletion.
   * @throws BadRequestException if the OTP is not valid.
   * @throws NotFoundException if the user is not found.
   */
  async afterDelete(id: string, otp: string) {
    const user = await this.findUserById(id);
    const otpCache = await this.redisService.get(`otp-code:${user.email}`);

    if (otp !== otpCache) throw new BadRequestException('OTP is incorrect');

    await this.usersRepository.delete({ id });

    await this.redisService.del(`user:${id}`);

    await this.userSearchService.deleteUser(id);

    await this.redisService.del(`otp-code:${user.email}`);

    return { message: 'Delete user successfully' };
  }

  /**
   * @description Finds a user by ID from the database and Redis cache.
   * If the user is not found, throws a NotFoundException.
   * If an error occurs while fetching the user, throws an Error.
   * @param id The ID of the user to find.
   * @returns The user object.
   */
  async findUserById(id: string): Promise<User> {
    try {
      const cacheKey = `user:${id}`;

      const userCache = await this.redisService.hGetAll(cacheKey);

      if (userCache && Object.keys(userCache).length > 0) {
        return userCache;
      }

      const user = await this.usersRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.redisService.hMSet(cacheKey, user);

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error in findUserById:', error);
      throw new Error('Failed to fetch user data');
    }
  }

  async updateUser(dto: UpdateUserDto, user: IUser, file: Express.Multer.File) {
    try {
      if (!file) {
        await this.usersRepository.update(
          { id: user.id },
          {
            ...dto,
          },
        );
      } else {
        const userDb = await this.findUserById(user.id);

        const avatar = userDb.avatar;

        if (avatar) {
          try {
            if (fs.existsSync(avatar)) {
              fs.unlinkSync(avatar);
            }
          } catch {
            throw new BadRequestException('Error when delete file');
          }
        }

        await this.usersRepository.update(
          { id: user.id },
          {
            ...dto,
            avatar: file.path,
          },
        );
      }

      await this.redisService.del(`user:${user.id}`);

      return {
        message: 'Update successful',
      };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Error updating user');
    }
  }

  /**
   * Sends an OTP to the user's email for password reset verification.
   * @param dto - Data transfer object containing the user's email and username.
   * @returns A promise containing a success message if the OTP is sent successfully.
   * @throws BadRequestException if the email or username is incorrect.
   * @throws InternalServerErrorException if an error occurs when sending the OTP.
   */
  async beforeForgotPassword(dto: SendOtpDto) {
    try {
      const user = await this.findUserByEmail(dto.email);

      if (!user || user.username !== dto.username)
        throw new BadRequestException('Email or username is incorrect');

      const otp = randomInt(100000, 999999).toString();

      await this.redisService.set(`otp-code:${dto.email}`, otp, 120);

      await this.sendEmail.add(
        'sendOTP',
        {
          email: user.email,
          username: user.username,
          otp: otp,
          template: 'otp-forgot-password-account',
        },
        { removeOnComplete: true },
      );

      return { message: 'Send OTP successfully' };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException('Error when send OTP');
    }
  }

  /**
   * Resets the user's password using the provided OTP.
   *
   * @param dto - Data transfer object containing the user's email, username, OTP, and new password.
   * @throws BadRequestException if the email, username, or OTP is incorrect.
   * @throws InternalServerErrorException if an error occurs during the password reset process.
   */
  async afterForgotPassword(dto: AfterForgotPasswordDto) {
    try {
      const user = await this.findUserByEmail(dto.email);
      const otp = await this.redisService.get(`otp-code:${dto.email}`);

      if (!user || user.username !== dto.username || otp !== dto.otp)
        throw new BadRequestException('Email or username or OTP is incorrect');

      const hashPassword = await this.getHashPassword(dto.password);

      await this.usersRepository.update(
        { id: user.id },
        {
          password: hashPassword,
        },
      );

      await this.redisService.del(`otp-code:${dto.email}`);

      return { message: 'Reset password successfully' };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException('Error when send OTP');
    }
  }
}
