import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RestrcitEmailDomainPipe implements PipeTransform {
  constructor(private readonly configService: ConfigService) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const validDomains = this.configService.get<string>(
      'ALLOWED_EMAIL_DOMAINS',
    )!;
    if (typeof value.email !== 'string')
      throw new BadRequestException(`invalid email format`);
    const domain = value.email.split('@')[1];
    const allowed = validDomains.split(',').map((d) => d.toLowerCase().trim());
    if (!allowed.includes(domain.toLowerCase()))
      throw new BadRequestException(
        `Email domain must be one of: ${validDomains.split(', ').join(', ')}`,
      );
    return value;
  }
}
