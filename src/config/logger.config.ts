import * as winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

// Config Elasticsearch Transport
const esTransportOpts = {
  level: 'info', // Write log level (info, warn, error)
  clientOpts: {
    node: process.env.ELASTICSEARCH_HOSTS || 'http://localhost:9200',
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
      password: process.env.ELASTICSEARCH_PASSWORD || 'tuanthanh',
    },
  },
  index: 'system-logs',
  mappingTemplate: {
    settings: {},
    mappings: {
      properties: {
        '@timestamp': { type: 'date' },
        message: { type: 'text' },
        level: { type: 'keyword' },
        timestamp: { type: 'date' },
        method: { type: 'keyword' }, // HTTP method (GET, POST, etc.)
        requestId: { type: 'keyword' }, // Unique request ID
        url: { type: 'keyword' }, // API path
        body: { type: 'object' }, // Request body
        query: { type: 'object' }, // Query params
        params: { type: 'object' }, // Route params
        headers: { type: 'object' }, // Request headers
        statusCode: { type: 'integer' }, // HTTP status code
        responseTime: { type: 'long' }, // Response time in ms
        userId: { type: 'keyword' }, // User ID
        role: { type: 'keyword' }, // User role (admin, user)
        deviceId: { type: 'keyword' }, // Device ID
        error: { type: 'object' }, // Error details (message, stack)
        environment: { type: 'keyword' }, // Environment (development, production)
        host: { type: 'keyword' }, // Hostname of the server
      },
    },
  },
};

const esTransport = new ElasticsearchTransport(esTransportOpts);

// Create logger
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    winston.format.json(),
    winston.format((info) => {
      info.environment = process.env.NODE_ENV || 'development';
      // info.host = os.hostname();
      return info;
    })(),
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    esTransport, // Log to Elasticsearch
  ],
});

// Handle errors in Elasticsearch transport
esTransport.on('error', (error) => {
  console.error('Error in Elasticsearch transport:', error);
});
