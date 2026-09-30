import type { LoginDto } from './dto/login.dto.js';
import type { JwtPayload } from './interfaces/jwt-payload.interface.js';
import type { LoginResponse } from './interfaces/login-response.interface.js';
import type { SessionUser } from './interfaces/session-user.interface.js';
import type { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

/** Checks credentials and issues the JWT that identifies the session. */
@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /** Returns a signed token and the session user; answers 401 with one message for any mismatch. */
  public async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.usersService.findOneWithPasswordByEmail(loginDto.email ?? '');
    const passwordMatches =
      user !== null && (await compare(loginDto.password ?? '', user.password));

    if (user === null || !passwordMatches) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    const payload: JwtPayload = { email: user.email, role: user.role, sub: user.id };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: AuthService.toSessionUser(user),
    };
  }

  /** Current data of the logged-in user; 401 if the account was deleted after the login. */
  public async getProfile(userId: number): Promise<SessionUser> {
    const user = await this.usersService.findOne(userId);

    if (user === null) {
      throw new UnauthorizedException('Tu cuenta ya no existe.');
    }

    return AuthService.toSessionUser(user);
  }

  /** Keeps only the fields the frontend needs, never the password. */
  private static toSessionUser(user: User): SessionUser {
    return { email: user.email, id: user.id, name: user.name, role: user.role };
  }
}
