import { Injectable } from '@nestjs/common';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import * as winston from 'winston';
import { Logger as LoggerCommon } from '@nestjs/common';
@Injectable()
export class LoggerService {
  private readonly logger: winston.Logger;
  private readonly loggerCommon = new LoggerCommon(LoggerService.name);

  constructor() {
    const esTransportOpts = {
      level: 'info',
      clientOpts: {
        node: process.env.ELASTICSEARCH_HOSTS || 'http://localhost:9200',
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
          password: process.env.ELASTICSEARCH_PASSWORD || 'tuanthanh',
        },
      },
      index: 'snet-system-logs',
      mappingTemplate: {
        settings: {},
        mappings: {
          properties: {
            '@timestamp': { type: 'date' },
            message: { type: 'text' },
            level: { type: 'keyword' },
            timestamp: { type: 'date' },
            method: { type: 'keyword' },
            requestId: { type: 'keyword' },
            url: { type: 'keyword' },
            body: { type: 'object' },
            query: { type: 'object' },
            params: { type: 'object' },
            headers: { type: 'object' },
            statusCode: { type: 'integer' },
            responseTime: { type: 'long' },
            userId: { type: 'keyword' },
            role: { type: 'keyword' },
            deviceId: { type: 'keyword' },
            error: { type: 'object' },
            environment: { type: 'keyword' },
            host: { type: 'keyword' },
          },
        },
      },
    };

    const esTransport = new ElasticsearchTransport(esTransportOpts);

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
        winston.format.json(),
        winston.format((info) => {
          info.environment = process.env.NODE_ENV || 'development';
          return info;
        })(),
      ),
      transports: [
        // new winston.transports.Console({
        //   format: winston.format.combine(
        //     winston.format.colorize(),
        //     winston.format.simple(),
        //   ),
        // }),
        esTransport,
      ],
    });

    esTransport.on('error', (error) => {
      console.error('Error in Elasticsearch transport:', error);
    });
  }

  log(message: string, context?: Record<string, any>) {
    this.logger.info({ message, ...context });
    this.loggerCommon.log({ message, ...context });
  }

  warn(message: string, context?: Record<string, any>) {
    this.logger.warn({ message, ...context });
    this.loggerCommon.warn({ message, ...context });
  }

  error(message: string, context?: Record<string, any>) {
    this.logger.error({ message, ...context });
    this.loggerCommon.error({ message, ...context });
  }
}
