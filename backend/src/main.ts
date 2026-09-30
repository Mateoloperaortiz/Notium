import { AppModule } from './app.module.js';
import { NestFactory } from '@nestjs/core';

/** Starts the API under /api, accepting only the CORS origins set in the environment. */
async function bootstrap(): Promise<void> {
  if ((process.env.JWT_SECRET ?? '').length < 32) {
    throw new Error(
      'JWT_SECRET must have at least 32 characters. Generate one as explained in .env.example.',
    );
  }

  const app = await NestFactory.create(AppModule);
  const corsOrigins = process.env.CORS_ORIGIN?.split(',').map((origin: string): string =>
    origin.trim(),
  );

  app.enableCors({
    origin: corsOrigins?.length ? corsOrigins : ['http://localhost:5173', 'http://localhost:4173'],
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
