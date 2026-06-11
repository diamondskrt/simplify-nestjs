import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';

const isDev = process.env.NODE_ENV === 'development';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: isDev
        ? false
        : {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", 'data:'],
            },
          },
    })
  );
  app.enableCors({
    origin: [process.env.WEB_URL!, process.env.EXPO_URL!],
    credentials: true,
  });

  app.use(compression());

  app.setGlobalPrefix('api');

  const port = process.env.PORT!;
  await app.listen(port);

  Logger.log(`🚀 Server running on http://localhost:${port}`, 'Bootstrap');
  Logger.log(
    `🍃 GraphQL Playground: http://localhost:${port}/graphql`,
    'Bootstrap'
  );
}
void bootstrap();
