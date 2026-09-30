import { Grade } from '../../grades/entities/grade.entity.js';
import { Semester } from '../../semesters/entities/semester.entity.js';
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

/** Course taken during a semester; deleting it deletes its grades. */
@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  public id: number;

  /** Foreign key kept as a column so the JSON always carries it without loading the relation. */
  @Column()
  public semesterId: number;

  @ManyToOne(() => Semester, (semester: Semester): Relation<Subject[]> => semester.subjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'semesterId' })
  public semester: Relation<Semester>;

  @Column()
  public code: string;

  @Column()
  public name: string;

  /** Positive integer. */
  @Column()
  public credits: number;

  @Column()
  public professor: string;

  @OneToMany(() => Grade, (grade: Grade): Relation<Subject> => grade.subject)
  public grades: Relation<Grade[]>;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
