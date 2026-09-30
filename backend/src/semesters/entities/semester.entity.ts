import { Subject } from '../../subjects/entities/subject.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { StatusSemester } from '../enums/status-semester.enum.js';
import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/** Academic period of a student; deleting it deletes its subjects and grades. */
@Entity()
export class Semester {
  @PrimaryGeneratedColumn()
  public id: number;

  /** Foreign key kept as a column so the JSON always carries it without loading the relation. */
  @Column()
  public userId: number;

  @ManyToOne(() => User, (user: User): Relation<Semester[]> => user.semesters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  public user: Relation<User>;

  @Column()
  public name: string;

  @Column()
  public year: number;

  /** 1 for the first half of the year, 2 for the second. */
  @Column()
  public period: number;

  @Column({ type: 'varchar' })
  public status: StatusSemester;

  @OneToMany(() => Subject, (subject: Subject): Relation<Semester> => subject.semester)
  public subjects: Relation<Subject[]>;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
