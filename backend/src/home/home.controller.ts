import { Public } from '../auth/decorators/public.decorator.js';
import { Controller, Get } from '@nestjs/common';

/** Health check used to confirm that the API is up. */
@Controller()
export class HomeController {
  /** Answers GET /api without requiring a session. */
  @Public()
  @Get()
  public index(): string {
    return 'API is running';
  }
}
