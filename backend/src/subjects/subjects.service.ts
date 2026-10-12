import type { CreateSubjectDto } from './dto/create-subject.dto.js';
import type { UpdateSubjectDto } from './dto/update-subject.dto.js';
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

  /** Returns the user's subjects, optionally only those of one of the user's semesters. */
  public async findAll(userId: number, semesterId?: number): Promise<Subject[]> {
    if (semesterId !== undefined && !Number.isInteger(semesterId)) {
      throw new BadRequestException('El semestre del filtro no es válido.');
    }

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
  public async findOne(id: number, userId: number): Promise<Subject> {
    const subject = Number.isInteger(id)
      ? await this.subjectsRepository
          .createQueryBuilder('subject')
          .innerJoin('subject.semester', 'semester')
          .where('subject.id = :id', { id })
          .andWhere('semester.userId = :userId', { userId })
          .getOne()
      : null;

    if (subject === null) {
      throw new NotFoundException('No encontramos la materia que buscas.');
    }

    return subject;
  }

  /** Validates the data and saves a new subject in a semester the user owns. */
  public async create(dto: CreateSubjectDto | undefined, userId: number): Promise<Subject> {
    const data = SubjectsService.validate(dto);

    await this.assertSemesterOwned(data.semesterId, userId);

    const subject = this.subjectsRepository.create(data);

    return this.subjectsRepository.save(subject);
  }

  /** Validates and applies the changes to a subject of the user. */
  public async update(
    id: number,
    dto: UpdateSubjectDto | undefined,
    userId: number,
  ): Promise<Subject> {
    const subject = await this.findOne(id, userId);
    const data = SubjectsService.validate({
      code: dto?.code ?? subject.code,
      credits: dto?.credits ?? subject.credits,
      name: dto?.name ?? subject.name,
      professor: dto?.professor ?? subject.professor,
      semesterId: dto?.semesterId ?? subject.semesterId,
    });

    if (data.semesterId !== subject.semesterId) {
      await this.assertSemesterOwned(data.semesterId, userId);
    }

    subject.code = data.code;
    subject.credits = data.credits;
    subject.name = data.name;
    subject.professor = data.professor;
    subject.semesterId = data.semesterId;

    return this.subjectsRepository.save(subject);
  }

  /** Deletes a subject of the user; its grades go in cascade. */
  public async remove(id: number, userId: number): Promise<void> {
    const subject = await this.findOne(id, userId);

    await this.subjectsRepository.remove(subject);
  }

  /** Throws 404 when the semester does not exist or belongs to another user. */
  private async assertSemesterOwned(semesterId: number, userId: number): Promise<void> {
    const semester = await this.semestersRepository.findOneBy({ id: semesterId });

    if (semester === null || semester.userId !== userId) {
      throw new NotFoundException('No encontramos el semestre que buscas.');
    }
  }

  /** Returns the data trimmed, or throws 400 with the first problem; the body may be missing. */
  private static validate(dto: CreateSubjectDto | undefined): CreateSubjectDto {
    if (dto === undefined) {
      throw new BadRequestException('Envía los datos de la materia.');
    }

    const code = typeof dto.code === 'string' ? dto.code.trim() : '';
    const name = typeof dto.name === 'string' ? dto.name.trim() : '';
    const professor = typeof dto.professor === 'string' ? dto.professor.trim() : '';

    if (!Number.isInteger(dto.semesterId)) {
      throw new BadRequestException('Selecciona un semestre.');
    }

    if (code === '') {
      throw new BadRequestException('El código es obligatorio.');
    }

    if (name === '') {
      throw new BadRequestException('El nombre es obligatorio.');
    }

    if (!Number.isInteger(dto.credits) || dto.credits <= 0) {
      throw new BadRequestException('Los créditos deben ser un número entero mayor que cero.');
    }

    if (professor === '') {
      throw new BadRequestException('El profesor es obligatorio.');
    }

    return { code, credits: dto.credits, name, professor, semesterId: dto.semesterId };
  }
}
