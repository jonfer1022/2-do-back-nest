import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { environments } from './common/utils/enviroments';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { TasksModule } from './tasks/tasks.module';

const pathsExclude = ['/auth/signup', '/auth/confirm-signup', '/auth/signin'];

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    TasksModule,
    ConfigModule.forRoot({
      load: [environments],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...pathsExclude)
      .forRoutes('*');
  }
}
