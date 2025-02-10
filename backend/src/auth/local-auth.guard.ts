import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*
    - Bảo vệ các route yêu câù xác thực local
*/
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
