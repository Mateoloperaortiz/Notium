import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
import { Subject } from './entities/subject.entity.js';
import { Semester } from '../semesters/entities/semester.entity.js';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/** Reads and writes the subjects of a student and validates their data. */
@Injectable()
export class SubjectsService {
  public constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
    @InjectRepository(Semester)
    private readonly semestersRepository: Repository<Semester>,
  ) {}

  /** Returns the users subjects, optionally only those of one of the user's semesters. */
  public findAllByUserId(userId: number, semesterId?: number): Promise<Subject[]> {
    const query = this.subjectsRepository
      .createQueryBuilder('subject')
      .innerJoin('subject.semester', 'semester')
      .where('semester.userId = :userId', { userId });

    if (semesterId !== undefined) {
      query.andWhere('subject.semesterId = :semesterId', { semesterId });
    }

    return query.getMany();
  }

  /** Returns one subject of the user; throws 404 if it does not exist or is another user's. */
  public async findOneByUserId(id: number, userId: number): Promise<Subject> {
    const subject = await this.subjectsRepository
      .createQueryBuilder('subject')
      .innerJoin('subject.semester', 'semester')
      .where('subject.id = :id', { id })
      .andWhere('semester.userId = :userId', { userId })
      .getOne();

    if (subject === null) {
      throw new NotFoundException('No encontramos la materia que buscas.');
    }

    return subject;
  }

  /** Validates the data and saves a new subject in a semester the user owns. */
  public async create(dto: CreateSubjectDto, userId: number): Promise<Subject> {
    SubjectsService.validate(dto);
    await this.assertSemesterOwned(dto.semesterId, userId);

    const subject = this.subjectsRepository.create({
      code: dto.code.trim(),
      credits: dto.credits,
      name: dto.name.trim(),
      professor: dto.professor.trim(),
      semesterId: dto.semesterId,
    });

    return this.subjectsRepository.save(subject);
  }

  /** Validates and applies the changes to a subject of the user. */
  public async update(id: number, dto: UpdateSubjectDto, userId: number): Promise<Subject> {
    const subject = await this.findOneByUserId(id, userId);
    const merged = {
      code: dto.code ?? subject.code,
      credits: dto.credits ?? subject.credits,
      name: dto.name ?? subject.name,
      professor: dto.professor ?? subject.professor,
      semesterId: dto.semesterId ?? subject.semesterId,
    };

    SubjectsService.validate(merged);

    if (merged.semesterId !== subject.semesterId) {
      await this.assertSemesterOwned(merged.semesterId, userId);
    }

    subject.code = merged.code.trim();
    subject.credits = merged.credits;
    subject.name = merged.name.trim();
    subject.professor = merged.professor.trim();
    subject.semesterId = merged.semesterId;

    return this.subjectsRepository.save(subject);
  }

  /** Deletes a subject of the user; its grades go in cascade. */
  public async remove(id: number, userId: number): Promise<void> {
    const subject = await this.findOneByUserId(id, userId);

    await this.subjectsRepository.remove(subject);
  }

  /** Throws 404 when the semester does not exist or belongs to another user. */
  private async assertSemesterOwned(semesterId: number, userId: number): Promise<void> {
    const semester = await this.semestersRepository.findOneBy({ id: semesterId });

    if (semester === null || semester.userId !== userId) {
      throw new NotFoundException('No encontramos el semestre que buscas.');
    }
  }

  /** Throws the first validation message in Spanish; returns nothing when the data is valid. */
  private static validate(dto: CreateSubjectDto): void {
    if ((dto.code?.trim() ?? '') === '') {
      throw new BadRequestException('El código es obligatorio.');
    }

    if ((dto.name?.trim() ?? '') === '') {
      throw new BadRequestException('El nombre es obligatorio.');
    }

    if (!Number.isInteger(dto.credits) || dto.credits <= 0) {
      throw new BadRequestException('Los créditos deben ser un número entero mayor que cero.');
    }

    if ((dto.professor?.trim() ?? '') === '') {
      throw new BadRequestException('El profesor es obligatorio.');
    }
  }
}
