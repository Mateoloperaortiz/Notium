import { HomeController } from './home.controller.js';
import { Module } from '@nestjs/common';

/** Exposes the health check at the root of the API. */
@Module({
  controllers: [HomeController],
})
export class HomeModule {}
