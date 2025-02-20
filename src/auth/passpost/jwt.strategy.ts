import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/users.interface';

/*
  - JwtStrategy: Dùng để định nghĩa chiến lược xác thực
  - Dùng PasspostStrategy để tạo chiến lược xác thực
*/
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      // Cấu hình chiến lược để trích xuất JWT từ headẻ Authorization dưới dạng bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  // Xác thực payload người dùng và trả về thông tin
  async validate(payload: IUser) {
    // const { id, email, , username } = payload;
    return payload;
  }
}
