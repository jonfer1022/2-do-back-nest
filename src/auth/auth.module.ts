import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CognitoService } from 'src/common/aws/cognito.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthService, CognitoService, ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
