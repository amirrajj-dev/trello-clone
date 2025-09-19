import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dtos/signup.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { WinstonLogger } from 'src/common/logger/logger.service';
import { LoginDto } from './dtos/login.dto';
import { AuthReturnType } from './types/auth-return.interface';
import { JwtPayload } from './types/auth-payload.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private logger: WinstonLogger,
  ) {}
  async signup(signUpDto: SignUpDto): Promise<AuthReturnType | null> {
    try {
      const { email, name, password } = signUpDto;
      const isUserExist = await this.usersService.findUserByEmailOrNull(email);
      if (isUserExist) {
        throw new NotAcceptableException(`User Already Exists`);
      }
      const SALT = this.configService.get<number>('SALT');
      const hashedPassword = await bcrypt.hash(password, SALT as number);
      const user = await this.usersService.createUser({
        name,
        email,
        password: hashedPassword,
      });
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      };
      const accessToken = this.jwtService.sign(payload);
      this.logger.log('User signed up successfully');
      return {
        access_token: accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      this.logger.error('error creating user');
      throw error;
    }
  }
  async login(loginDto: LoginDto): Promise<AuthReturnType | null> {
    try {
      const { email, password } = loginDto;
      const user = await this.usersService.findUserByEmailOrNull(email);
      if (!user) {
        throw new NotFoundException(`User Not Found`);
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid Credentials');
      }
      const payload: JwtPayload = {
        email: user.email,
        name: user.name,
        sub: user.id,
      };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '30d',
      });
      this.logger.log('user logged in succesfully');
      return {
        access_token: accessToken,
        user: {
          email: user.email,
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      this.logger.log('Internal Server Error');
      throw error;
    }
  }
  async validateUser(payload: JwtPayload) {
    const user = await this.usersService.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
