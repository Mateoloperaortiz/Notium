import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { Role } from './enums/role.enum.js';
import { UsersService } from './users.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

/** User management endpoints under /api/users; restricted to administrators. */
@Roles(Role.Admin)
@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  /** GET /api/users: every user, without passwords. */
  @Get()
  public findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /** GET /api/users/:id: one user; 404 if it does not exist. */
  @Get(':id')
  public findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOneOrFail(Number(id));
  }

  /** POST /api/users: creates a user; 409 if the email already exists. */
  @Post()
  public create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /** PATCH /api/users/:id: updates a user. */
  @Patch(':id')
  public update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(Number(id), updateUserDto);
  }

  /** DELETE /api/users/:id: removes a user and their data in cascade; returns 204. */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(Number(id));
  }
}
