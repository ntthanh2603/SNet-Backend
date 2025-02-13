import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://trusted.cdn.com'],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
          ],
          imgSrc: ["'self'", 'data:', 'https://images.trusted.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          objectSrc: ["'none'"],
        },
      },
      hsts: false, // Tắt HSTS để chạy HTTP
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  // Interceptor
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  app.useStaticAssets(join(__dirname, '..', 'public')); // js, css, images
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // view
  app.setViewEngine('ejs');

  // Config CORS
  app.enableCors({
    origin: '*', // Cho phép frontend ở mọi cổng
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được phép
    credentials: true, // Nếu bạn sử dụng cookie hoặc thông tin xác thực
  });

  // Config swagger
  const config = new DocumentBuilder()
    .setTitle('Project social spaces')
    .setDescription('All Module API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .setVersion('1.0')
    .build();

  // Để mở documentation thì dùng lệnh sau npx @compodoc/compodoc -p tsconfig.json -s
  // Rồi vào cổng http://localhost:8080/ để mở documentation

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    // Dùng option thứ 4 này để khi reload lại trang swagger thì không mất token
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
