import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  home() {
    return 'Đây là trang chủ';
  }
}
