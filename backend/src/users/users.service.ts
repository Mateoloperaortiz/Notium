import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { Role } from './enums/role.enum.js';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';

/** Reads and writes user accounts and validates their data; used by the admin and by auth. */
@Injectable()
export class UsersService {
  /** Cost factor for the bcrypt hash of new passwords. */
  private static readonly SALT_ROUNDS = 10;

  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /** Returns every user; the password is never selected. */
  public findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /** Returns the user with the given ID, or null if it does not exist. */
  public findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  /** Returns the user with the given ID; throws 404 if it does not exist. */
  public async findOneOrFail(id: number): Promise<User> {
    const user = await this.findOne(id);

    if (user === null) {
      throw new NotFoundException('No encontramos el usuario que buscas.');
    }

    return user;
  }

  /** Returns the user with the given email including the password hash, for the login only. */
  public findOneWithPasswordByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email.trim().toLowerCase() })
      .getOne();
  }

  /** Validates the data and saves a new user; throws 409 if the email already exists. */
  public async create(dto: CreateUserDto): Promise<User> {
    UsersService.validate(dto);
    const email = dto.email.trim().toLowerCase();

    await this.assertEmailFree(email);

    const user = this.usersRepository.create({
      email,
      name: dto.name.trim(),
      password: await hash(dto.password, UsersService.SALT_ROUNDS),
      role: dto.role,
    });

    const saved = await this.usersRepository.save(user);

    return this.findOneOrFail(saved.id);
  }

  /** Validates and applies the changes; throws 404 if the user does not exist, 409 on a taken email. */
  public async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOneOrFail(id);
    const merged = {
      email: dto.email ?? user.email,
      name: dto.name ?? user.name,
      password: dto.password ?? '',
      role: dto.role ?? user.role,
    };

    UsersService.validate(merged, dto.password === undefined);
    const email = merged.email.trim().toLowerCase();

    if (email !== user.email) {
      await this.assertEmailFree(email);
    }

    user.email = email;
    user.name = merged.name.trim();
    user.role = merged.role;

    if (dto.password !== undefined) {
      user.password = await hash(dto.password, UsersService.SALT_ROUNDS);
    }

    await this.usersRepository.save(user);

    return this.findOneOrFail(id);
  }

  /** Deletes a user; their semesters, subjects and grades go in cascade. */
  public async remove(id: number): Promise<void> {
    const user = await this.findOneOrFail(id);

    await this.usersRepository.remove(user);
  }

  /** Throws 409 when another user already uses the email. */
  private async assertEmailFree(email: string): Promise<void> {
    const existing = await this.usersRepository.findOneBy({ email });

    if (existing !== null) {
      throw new ConflictException('Ya existe un usuario con este correo.');
    }
  }

  /** Throws the first validation message in Spanish; skipPassword leaves the current one untouched. */
  private static validate(
    dto: { name: string; email: string; password: string; role: Role },
    skipPassword = false,
  ): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if ((dto.name?.trim() ?? '') === '') {
      throw new BadRequestException('El nombre es obligatorio.');
    }

    if (!emailPattern.test(dto.email?.trim().toLowerCase() ?? '')) {
      throw new BadRequestException('Ingresa un correo válido.');
    }

    if (!Object.values(Role).includes(dto.role)) {
      throw new BadRequestException('Selecciona un rol válido.');
    }

    if (!skipPassword && (dto.password?.trim().length ?? 0) < 6) {
      throw new BadRequestException('La contraseña debe tener al menos 6 caracteres.');
    }
  }
}
