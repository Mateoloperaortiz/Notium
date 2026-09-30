import { AppModule } from './app.module.js';
import { NestFactory } from '@nestjs/core';

/** Starts the API under /api, accepting only the CORS origins set in the environment. */
async function bootstrap(): Promise<void> {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required: copy .env.example to .env to run the API locally.');
  }

  const app = await NestFactory.create(AppModule);
  const corsOrigins = process.env.CORS_ORIGIN?.split(',').map((origin: string): string =>
    origin.trim(),
  );

  app.enableCors({ origin: corsOrigins?.length ? corsOrigins : ['http://localhost:5173'] });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
