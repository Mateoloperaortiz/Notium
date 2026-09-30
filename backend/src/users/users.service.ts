import { User } from './entities/user.entity.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/** Reads user accounts from the database. */
@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /** Returns the user with the given ID, or null if it does not exist. */
  public findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  /** Returns the user with the given email including the password hash, for the login only. */
  public findOneWithPasswordByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email.trim().toLowerCase() })
      .getOne();
  }
}
