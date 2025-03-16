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
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
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
import { UserSearchBody } from 'src/search-engine/interfaces/user-search-body.interface';
import { PrivacyType } from 'src/helper/privacy.enum';
import { RelationsService } from 'src/relations/relations.service';
import { RelationType } from 'src/helper/relation.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private redisService: RedisService,
    private diviceSessionsService: DeviceSessionsService,
    private readonly configService: ConfigService,
    @InjectQueue('sendEmail')
    private sendEmail: Queue,
    private readonly userSearchService: UserSearchService,
    @Inject(forwardRef(() => RelationsService))
    private readonly relationsService: RelationsService,
  ) {}

  getHashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
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
   * @param dto - The data transfer object containing the user's email, password and OTP.
   * @param metaData - The metadata of the user's login session.
   * @returns The result of DeviceSessionService#handleLogin.
   * @throws BadRequestException if the OTP is not valid.
   * @throws NotFoundException if the user is not found.
   * @throws UnauthorizedException if the password is not valid.
   */
  async afterlogin(dto: AfterLoginDto, metaData: LoginMetaData) {
    const user = await this.validateUser(dto.email, dto.password);

    const otp = await this.redisService.get(`otp-code:${dto.email}`);

    if (otp !== dto.otp)
      throw new BadRequestException('OTP code is incorrect or expired');

    await this.redisService.del(`otp-code:${dto.email}`);

    return await this.diviceSessionsService.handleLogin(user.id, metaData);
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

  /**
   * Handles the sign up process.
   * @param dto - The data transfer object containing the user's information.
   * @returns The result of UserSearchService#createUser.
   * @throws BadRequestException if the OTP is not valid.
   * @throws InternalServerErrorException if an error occurs while saving the user to the database.
   */
  async afterSignUp(dto: AfterSignUpDto) {
    try {
      const otp = await this.redisService.get(`otp-code:${dto.email}`);

      if (otp !== dto.otp)
        throw new BadRequestException('OTP code is incorrect or expired');

      const hashPassword = this.getHashPassword(dto.password);

      const newUser = {
        email: dto.email,
        password: hashPassword,
        avatar: dto.avatar,
        username: dto.username,
        bio: dto.bio,
        website: dto.website,
        birthday: dto.birthday,
        gender: dto.gender,
        address: dto.address,
        privacy: PrivacyType.PUBLIC,
      };

      const userDb = await this.usersRepository.save(newUser);

      const userSearchBody: UserSearchBody = {
        id: userDb.id,
        email: userDb.email,
        username: userDb.username,
        avatar: userDb.avatar,
        bio: userDb.bio,
        website: userDb.website,
        gender: userDb.gender,
        address: userDb.address,
      };

      await this.userSearchService.createUser(userSearchBody);

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
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException();
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

  /**
   * @description Updates a user's information in the database.
   * If a username is provided, checks for its uniqueness.
   * If a file is provided, updates the user's avatar and deletes the old one.
   * Clears the user's cache in Redis after updating.
   * @param dto - The data transfer object containing updated user information.
   * @param user - The user object representing the current user.
   * @param file - The uploaded file object, representing the user's new avatar.
   * @returns A message indicating successful update.
   * @throws BadRequestException if the username already exists or error occurs when deleting the file.
   * @throws InternalServerErrorException if an error occurs during the update process.
   */
  async updateUser(dto: UpdateUserDto, user: IUser, file: Express.Multer.File) {
    try {
      if (dto.username) {
        const userDb = await this.usersRepository.findOne({
          where: { username: dto.username },
        });

        if (userDb) {
          throw new BadRequestException(
            `Username ${dto.username} has existed.`,
          );
        }
      }
      if (!file) {
        await this.usersRepository.update(
          { id: user.id },
          {
            ...dto,
          },
        );
      } else {
        const findUser = await this.findUserById(user.id);

        const avatar = findUser.avatar;

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
}
