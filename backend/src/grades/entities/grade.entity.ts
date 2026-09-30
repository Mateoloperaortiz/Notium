import { Subject } from '../../subjects/entities/subject.entity.js';
import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/** Result of one assessment of a subject. */
@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  public id: number;

  /** Foreign key kept as a column so the JSON always carries it without loading the relation. */
  @Column()
  public subjectId: number;

  @ManyToOne(() => Subject, (subject: Subject): Relation<Grade[]> => subject.grades, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subjectId' })
  public subject: Relation<Subject>;

  @Column()
  public title: string;

  /** Score on the 0 to 5 scale. */
  @Column({ type: 'real' })
  public value: number;

  /** Weight of the grade in the subject, an integer from 1 to 100. */
  @Column()
  public percentage: number;

  @Column()
  public type: string;

  /** Assessment date as an ISO string (YYYY-MM-DD). */
  @Column({ type: 'varchar' })
  public date: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
