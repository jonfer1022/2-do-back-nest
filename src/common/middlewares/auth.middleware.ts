import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestAuth } from '../types/request.type';
import { CognitoService } from '../aws/cognito.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
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

  async use(req: RequestAuth, res: Response, next: (error?: any) => void) {
    const { authorization } = req.headers;
    const accessToken = authorization?.split('Bearer ')[1];

    if (!accessToken) {
      throw new Error('Unauthorized');
    } else {
      const userVerified =
        await this.cognitoService.verifyAccessToken(accessToken);
      req.user = { token: accessToken };

      userVerified.UserAttributes.forEach(
        (element: { Name: string; Value: string }) => {
          if (element.Name === 'email') {
            req.user.email = element.Value;
          } else if (element.Name === 'name') {
            req.user.name = element.Value;
          }
        },
      );

      const user = await this.prisma.users.findFirst({
        where: { email: req.user.email },
      });

      if (!user) throw new Error('User not found');
      req.user.id = user.id;
    }
    next();
  }
}
