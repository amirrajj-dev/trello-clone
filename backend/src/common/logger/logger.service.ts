import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as fs from 'fs';

@Injectable()
export class WinstonLogger implements LoggerService {
  private logger: winston.Logger;
  constructor(private readonly configService: ConfigService) {
    if (!fs.existsSync('logs')) fs.mkdirSync('logs');
    const NODE_ENV = configService.get<string>('NODE_ENV');
    this.logger = winston.createLogger({
      level: NODE_ENV === 'development' ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console(),
      ],
    });
  }
  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, { trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
