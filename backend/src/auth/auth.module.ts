import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RestrcitEmailDomainPipe } from 'src/common/pipes/restrict-email.pipe';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
@Module({
  providers: [AuthService, RestrcitEmailDomainPipe, JwtStrategy],
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '1h',
          },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  exports: [JwtStrategy, JwtModule, AuthService],
})
export class AuthModule {}
