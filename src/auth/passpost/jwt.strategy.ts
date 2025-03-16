import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUser } from 'src/users/users.interface';
import { DeviceSessionsService } from 'src/device-sessions/device-sessions.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly deviceSessionsService: DeviceSessionsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        try {
          // Decode token and get `deviceSessionId`
          const payload: any = JSON.parse(
            Buffer.from(rawJwtToken.split('.')[1], 'base64').toString(),
          );

          if (!payload.deviceSecssionId) {
            return done(
              new UnauthorizedException('Invalid token payload'),
              null,
            );
          }

          // Find device session
          const deviceSession = await this.deviceSessionsService.findOne(
            payload.deviceSewssionId,
          );

          if (!deviceSession || !deviceSession.secret_key) {
            return done(
              new UnauthorizedException('Invalid device session'),
              null,
            );
          }

          // Return secret key
          return done(null, deviceSession.secret_key);
        } catch {
          return done(new UnauthorizedException('Invalid token format'), null);
        }
      },
    });
  }

  async validate(payload: IUser) {
    return payload;
  }
}
