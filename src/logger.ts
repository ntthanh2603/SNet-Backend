import * as winston from 'winston';
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

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      level: 'info',
      dirname: path.join(__dirname, '../nestjs-logs/'),
      filename: path.join(__dirname, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '100m',
    }),
  ],
});

export default logger;
