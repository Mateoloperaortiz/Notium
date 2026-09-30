import { Semester } from '../../semesters/entities/semester.entity.js';
import { Role } from '../enums/role.enum.js';
import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/** Platform account: a student or an administrator. */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  /** Unique and stored in lowercase. */
  @Column({ unique: true })
  public email: string;

  /** bcrypt hash; never selected unless a query asks for it explicitly. */
  @Column({ select: false })
  public password: string;

  @Column({ type: 'varchar', default: Role.User })
  public role: Role;

  @OneToMany(() => Semester, (semester: Semester): Relation<User> => semester.user)
  public semesters: Relation<Semester[]>;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
