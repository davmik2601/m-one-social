import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { setupSwagger } from '@Config/swagger.config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /** enable CORS for all origins */
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  /** set up the Swagger documentation */
  setupSwagger(app);

  /** global validation pipe config (for dto) */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const PORT = process.env.PORT || 4000;

  await app.listen(PORT, () => {
    console.info(`Server is running on port: ${PORT}`);
  });
}

void bootstrap();
