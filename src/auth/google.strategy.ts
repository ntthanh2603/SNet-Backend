import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { CreateAccountWithGoogleDto } from 'src/users/dto/create-account-with-google.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    done: VerifyCallback,
  ): Promise<any> {
    const user = new CreateAccountWithGoogleDto();
    user.email = profile.emails[0].value;
    user.username = profile.displayName;
    user.avatar = profile.photos[0].value;
    user.password = '';

    return await this.authService.validateTokenGoogle(user);
  }
}

// accessToken ya29.a0AW4XtxhHXhWgEVE2VNiTetMB19o2G2jfKQ2GFkgnOn8Ui6zRSFs1Cxhy7639_TlRY8ajTFVqChbrOOQgkcfho-AcXdLsffs_Zdp21h9UVcqrGDTXSWFTHNYuKt6QsslRScpVADG5IlMev-XqRniyHubPygsHdyHp2BnUGBq-aCgYKAZUSARYSFQHGX2MiGDAKhXVywGjMCYOJGwsojQ0175
// refreshToken undefined
// profile {
//   id: '101044400483186205867',
//   displayName: 'Thành Tuấn',
//   name: { familyName: 'Tuấn', givenName: 'Thành' },
//   emails: [ { value: 'tuanthanh2kk4@gmail.com', verified:
//  true } ],
//   photos: [
//     {
//       value: 'https://lh3.googleusercontent.com/a/ACg8ocJIJ43GB6PDJpco42Kdp__TcUrIfbwcWiY_xlMugg2BvcORFBo=s96-c'
//     }
//   ],
//   provider: 'google',
//   _raw: '{\n' +
//     '  "sub": "101044400483186205867",\n' +
//     '  "name": "Thành Tuấn",\n' +
//     '  "given_name": "Thành",\n' +
//     '  "family_name": "Tuấn",\n' +
//     '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocJIJ43GB6PDJpco42Kdp__TcUrIfbwcWiY_xlMugg2BvcORFBo\\u003ds96-c",\n' +
//     '  "email": "tuanthanh2kk4@gmail.com",\n' +
//     '  "email_verified": true\n' +
//     '}',
//   _json: {
//     sub: '101044400483186205867',
//     name: 'Thành Tuấn',
//     given_name: 'Thành',
//     family_name: 'Tuấn',
//     picture: 'https://lh3.googleusercontent.com/a/ACg8ocJIJ43GB6PDJpco42Kdp__TcUrIfbwcWiY_xlMugg2BvcORFBo=s96-c',
//     email: 'tuanthanh2kk4@gmail.com',
//     email_verified: true
//   }
// }
