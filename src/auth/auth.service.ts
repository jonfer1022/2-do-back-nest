import { Injectable } from '@nestjs/common';
import { AuthSignInDto, AuthSignUpDto } from './dto/auth.dto';
import { CognitoService } from 'src/common/aws/cognito.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private cognitoService: CognitoService;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.cognitoService = new CognitoService(
      this.configService.get<string>('awsCognito.region'),
      this.configService.get<string>('awsCognito.clientId'),
      this.configService.get<string>('awsCognito.clientSecret'),
    );
  }

  async signUp(authDto: AuthSignUpDto) {
    try {
      const { email, password, name } = authDto;
      const user = await this.prisma.users.findFirst({
        where: { email },
      });

      if (user) throw new Error('User already exists');
      const attributes = [
        {
          Name: 'name',
          Value: name,
        },
      ];

      const result = await this.cognitoService.signUp(
        email,
        password,
        attributes,
      );

      return result;
    } catch (error) {
      const { message } = error;
      console.log('-----> ~ authService ~ signUp ~ error:', message || error);
      throw new Error('Failed to sign up: ' + message);
    }
  }

  async confirmSignUp(authDto: AuthSignUpDto, code: string) {
    try {
      const { email, name, password } = authDto;
      await this.cognitoService.confirmSignUp(email, code);

      await this.prisma.users.create({
        data: {
          email,
          name,
        },
      });

      return await this.cognitoService.signIn(email, password);
    } catch (error) {
      const { message } = error;
      console.log(
        '-----> ~ authService ~ confirmSignUp ~ error:',
        message || error,
      );
      throw new Error('Failed to confirm sign up: ' + error.message);
    }
  }

  async signIn(authDto: AuthSignInDto) {
    try {
      const { email, password } = authDto;

      const user = await this.prisma.users.findFirst({
        where: { email },
      });

      if (!user) throw new Error('User not found');

      const {
        AuthenticationResult: { AccessToken, RefreshToken },
      } = await this.cognitoService.signIn(email, password);

      return { accessToken: AccessToken, refreshToken: RefreshToken };
    } catch (error) {
      const { message } = error;
      console.log('-----> ~ authService ~ signIn ~ error:', message || error);
      throw new Error('Failed to sign in: ' + error.message);
    }
  }

  async signOut(accessToken: string) {
    try {
      return await this.cognitoService.signOut(accessToken);
    } catch (error) {
      const { message } = error;
      console.log('-----> ~ authService ~ signOut ~ error:', message || error);
      throw new Error('Failed to sign out: ' + error.message);
    }
  }
}
