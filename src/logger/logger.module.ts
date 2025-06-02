import { Global, Module } from '@nestjs/common';
import { LogNestService } from './log-nest.service';

@Global()
@Module({
  providers: [LogNestService],
  exports: [LogNestService],
})
export class LoggerModule {}
