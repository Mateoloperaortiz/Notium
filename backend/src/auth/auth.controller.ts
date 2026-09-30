import { AuthService } from './auth.service.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { Public } from './decorators/public.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import type { JwtPayload } from './interfaces/jwt-payload.interface.js';
import type { LoginResponse } from './interfaces/login-response.interface.js';
import type { SessionUser } from './interfaces/session-user.interface.js';
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';

/** Login and session endpoints under /api/auth. */
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  /** POST /api/auth/login: public; returns the token and the session user. */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  /** GET /api/auth/profile: the user of the current token. */
  @Get('profile')
  public getProfile(@CurrentUser() user: JwtPayload): Promise<SessionUser> {
    return this.authService.getProfile(user.sub);
  }
}
