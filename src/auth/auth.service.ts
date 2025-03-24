import { JwtService } from '@nestjs/jwt';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeviceSessionsService } from 'src/device-sessions/device-sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(forwardRef(() => DeviceSessionsService))
    private readonly deviceSessionsService: DeviceSessionsService,
  ) {}
  verify(token: string) {
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

  generateAccessToken(payload: any, secretKey: string) {
    const accessToken = this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
    });

    return accessToken;
  }
}
