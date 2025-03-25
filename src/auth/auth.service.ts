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

  /**
   * Verify a given JWT token, using the secret key from the associated device session.
   *
   * @param token The JWT token to verify.
   * @returns The decoded payload if the token is valid.
   * @throws An error if the token is invalid or cannot be decoded.
   */

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

  generateAccessToken(payload: any, secretKey: string) {
    const accessToken = this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
    });

    return accessToken;
  }
}
