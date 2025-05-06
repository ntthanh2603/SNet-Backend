import * as winston from 'winston';
import * as path from 'path';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      // filename: path.join(__dirname, '../logs/app.log'),   // Log when backend in docker
      filename: path.join(__dirname, '../nestjs-log/logs/app.log'),
    }),
  ],
});

export default logger;
