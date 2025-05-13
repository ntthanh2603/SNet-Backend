import { JwtService } from '@nestjs/jwt';
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeviceSessionsService } from 'src/device-sessions/device-sessions.service';
import { OAuth2Client } from 'google-auth-library';
import { IPayload } from './payload.interface';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AfterSignUpDto } from 'src/users/dto/after-signup.dto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(forwardRef(() => DeviceSessionsService))
    private readonly deviceSessionsService: DeviceSessionsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async validateTokenGoogle(googleUser: AfterSignUpDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: googleUser.email },
      });
      if (user) return user;
      return await this.userRepository.save(googleUser);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async verify(token: string) {
    try {
      // Decode token
      const decoded = this.jwtService.decode(token);

      // Get secret key from device session
      const secret = await this.deviceSessionsService.getSecret(
        decoded.id,
        decoded.deviceSecssionid,
      );

      // Return payload if valid token
      return this.jwtService.verify(token, {
        secret: secret,
      });
    } catch (error) {
      throw new Error(`Failed to verify token: ${error.message}`);
    }
  }

  decode(token: string) {
    try {
      const decoded = this.jwtService.decode(token);
      if (!decoded) {
        throw new Error('Invalid token');
      }
      return decoded;
    } catch (error) {
      throw new Error(`Failed to decode token: ${error.message}`);
    }
  }

  generateAccessToken(payload: IPayload, secretKey: string) {
    const accessToken = this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
    });

    return accessToken;
  }
}
