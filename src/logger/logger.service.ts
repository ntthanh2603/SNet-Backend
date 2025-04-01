import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import * as winston from 'winston';
import { Logger as LoggerCommon } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly loggerCommon = new LoggerCommon(LoggerService.name);
  private readonly transportsCache = new Map<string, ElasticsearchTransport>();

  constructor(private readonly configService: ConfigService) {}

  private createElasticsearchTransport(index: string): ElasticsearchTransport {
    if (this.transportsCache.has(index)) {
      return this.transportsCache.get(index);
    }

    const esTransportOpts = {
      level: 'info',
      clientOpts: {
        node: this.configService.get('ELASTICSEARCH_HOSTS'),
        auth: {
          username: this.configService.get('ELASTICSEARCH_USERNAME'),
          password: this.configService.get('ELASTICSEARCH_PASSWORD'),
        },
      },
      index,
      mappingTemplate: {
        settings: {},
        mappings: {
          properties: {
            '@timestamp': { type: 'date' },
            message: { type: 'text' },
            level: { type: 'keyword' },
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
            deviceSecssionId: { type: 'keyword' },
            error: { type: 'object' },
            metadata: { type: 'object' },
            environment: this.configService.get('NODE_ENV'),
            host: this.configService.get('HOST'),
          },
        },
      },
    };

    const esTransport = new ElasticsearchTransport(esTransportOpts);
    this.transportsCache.set(index, esTransport);

    esTransport.on('error', (error) => {
      console.error('Error in Elasticsearch transport:', error);
    });
    return esTransport;
  }

  private getLogger(index: string): winston.Logger {
    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
        winston.format.json(),
        winston.format((info) => {
          info.environment = process.env.NODE_ENV || 'development';
          return info;
        })(),
      ),
      transports: [this.createElasticsearchTransport(index)],
    });
  }

  log(context?: Record<string, any>, index = 'snet-system-logs') {
    this.getLogger(index).info(context);
    this.loggerCommon.log(JSON.stringify(context));
  }

  warn(context?: Record<string, any>, index = 'snet-system-logs') {
    this.getLogger(index).warn(context);
    this.loggerCommon.warn(JSON.stringify(context));
  }

  error(context?: Record<string, any>, index = 'snet-system-logs') {
    this.getLogger(index).error(context);
    this.loggerCommon.error(JSON.stringify(context));
  }
}
