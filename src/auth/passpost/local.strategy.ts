// import { UsersService } from './../../users/users.service';
// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { User } from 'src/users/entities/user.entity';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private userService: UsersService) {
//     super();
//   }

//   // Validate account use email, password
//   async validate(email: string, password: string): Promise<User> {
//     const user = await this.userService.validateUser(email, password);
//     if (!user) {
//       throw new UnauthorizedException('Email hoặc mật khẩu không hợp lệ.');
//     }
//     return user;
//   }
// }
