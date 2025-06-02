/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, Logger, format, transports } from 'winston';
import * as dayjs from 'dayjs';
import * as chalk from 'chalk';
import * as path from 'path';
import 'winston-daily-rotate-file';

/**
 error: 0
 warn: 1
 info: 2
 http: 3
 verbose: 4
 debug: 5
 silly: 6
*/

@Injectable()
export class LogNestService implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.printf(({ context, message, level, time }) => {
              const pid = process.pid;
              const strApp = chalk.green('[Nest]');
              const strPid = chalk.green(`${pid}`);
              const strContext = chalk.yellow(`[${context}]`);

              let formattedLevel = '';
              switch (level) {
                case 'info':
                  formattedLevel = chalk.green('LOG');
                  break;
                case 'error':
                  formattedLevel = chalk.red('ERROR');
                  break;
                case 'warn':
                  formattedLevel = chalk.yellow('WARN');
                  break;
                case 'debug':
                  formattedLevel = chalk.magenta('DEBUG');
                  break;
                default:
                  formattedLevel = level.toUpperCase();
              }

              return `${strApp} ${strPid}  - ${time}     ${formattedLevel} ${strContext} ${message}`;
            }),
          ),
        }),
        new transports.DailyRotateFile({
          level: 'debug',
          dirname: path.join(__dirname, '../../nestjs-logs/'),
          filename: 'app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '100m',
          format: format.combine(
            format.printf(({ context, message, level, time }) => {
              const pid = process.pid;
              const formattedLevel = level.toUpperCase();
              return `[Nest] ${pid}  - ${time}     ${formattedLevel} [${context}] ${message}`;
            }),
          ),
        }),
      ],
    });
  }

  log(message: string, context: string) {
    const time = dayjs().format('DD/MM/YYYY, h:mm:ss A');
    this.logger.log('info', message, { context, time });
  }

  error(message: string, context: string) {
    const time = dayjs().format('DD/MM/YYYY, h:mm:ss A');
    this.logger.error(message, { context, time });
  }

  warn(message: string, context: string) {
    const time = dayjs().format('DD/MM/YYYY, h:mm:ss A');
    this.logger.warn(message, { context, time });
  }

  debug(message: string, context: string) {
    const time = dayjs().format('DD/MM/YYYY, h:mm:ss A');
    this.logger.debug(message, { context, time });
  }
}
