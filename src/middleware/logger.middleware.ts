import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const logger = new Logger('Request');
    logger.log(`${req.method} ${req.url}`);
    next();
  }
}
