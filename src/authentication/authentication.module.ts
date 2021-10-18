import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../users';
import { LocalStrategy } from './local.strategy';
import { AuthenticationController } from './authentication.controller';
import { JwtStrategy } from './jwt.strategy';
import { JWT } from '../constants';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(JWT.SECRET),
        signOptions: {
          expiresIn: `${configService.get(JWT.EXPIRATION_TIME)}s`,
        },
      }),
    }),
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
