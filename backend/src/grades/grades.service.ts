import type { CreateGradeDto } from './dto/create-grade.dto.js';
import type { UpdateGradeDto } from './dto/update-grade.dto.js';
import { Grade } from './entities/grade.entity.js';
import { Subject } from '../subjects/entities/subject.entity.js';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/** Reads and writes the grades of a student and validates their data. */
@Injectable()
export class GradesService {
  public constructor(
    @InjectRepository(Grade)
    private readonly gradesRepository: Repository<Grade>,
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
  ) {}

  /** Returns the user's grades, optionally only those of one of the user's subjects. */
  public async findAll(userId: number, subjectId?: number): Promise<Grade[]> {
    if (subjectId !== undefined && !Number.isInteger(subjectId)) {
      throw new BadRequestException('La materia del filtro no es válida.');
    }

    const query = this.gradesRepository
      .createQueryBuilder('grade')
      .innerJoin('grade.subject', 'subject')
      .innerJoin('subject.semester', 'semester')
      .where('semester.userId = :userId', { userId });

    if (subjectId !== undefined) {
      query.andWhere('grade.subjectId = :subjectId', { subjectId });
    }

    return query.getMany();
  }

  /** Returns one grade of the user; throws 404 if it does not exist or is another user's. */
  public async findOne(id: number, userId: number): Promise<Grade> {
    const grade = Number.isInteger(id)
      ? await this.gradesRepository
          .createQueryBuilder('grade')
          .innerJoin('grade.subject', 'subject')
          .innerJoin('subject.semester', 'semester')
          .where('grade.id = :id', { id })
          .andWhere('semester.userId = :userId', { userId })
          .getOne()
      : null;

    if (grade === null) {
      throw new NotFoundException('No encontramos la nota que buscas.');
    }

    return grade;
  }

  /** Validates the data and saves a new grade in a subject the user owns. */
  public async create(dto: CreateGradeDto | undefined, userId: number): Promise<Grade> {
    const data = GradesService.validate(dto);

    await this.assertSubjectOwned(data.subjectId, userId);

    const grade = this.gradesRepository.create(data);

    return this.gradesRepository.save(grade);
  }

  /** Validates and applies the changes to a grade of the user. */
  public async update(id: number, dto: UpdateGradeDto | undefined, userId: number): Promise<Grade> {
    const grade = await this.findOne(id, userId);
    const data = GradesService.validate({
      date: dto?.date ?? grade.date,
      percentage: dto?.percentage ?? grade.percentage,
      subjectId: dto?.subjectId ?? grade.subjectId,
      title: dto?.title ?? grade.title,
      type: dto?.type ?? grade.type,
      value: dto?.value ?? grade.value,
    });

    if (data.subjectId !== grade.subjectId) {
      await this.assertSubjectOwned(data.subjectId, userId);
    }

    grade.date = data.date;
    grade.percentage = data.percentage;
    grade.subjectId = data.subjectId;
    grade.title = data.title;
    grade.type = data.type;
    grade.value = data.value;

    return this.gradesRepository.save(grade);
  }

  /** Deletes a grade of the user. */
  public async remove(id: number, userId: number): Promise<void> {
    const grade = await this.findOne(id, userId);

    await this.gradesRepository.remove(grade);
  }

  /** Throws 404 when the subject does not exist or belongs to another user. */
  private async assertSubjectOwned(subjectId: number, userId: number): Promise<void> {
    const subject = await this.subjectsRepository
      .createQueryBuilder('subject')
      .innerJoin('subject.semester', 'semester')
      .where('subject.id = :subjectId', { subjectId })
      .andWhere('semester.userId = :userId', { userId })
      .getOne();

    if (subject === null) {
      throw new NotFoundException('No encontramos la materia que buscas.');
    }
  }

  /** Returns the data trimmed, or throws 400 with the first problem; the body may be missing. */
  private static validate(dto: CreateGradeDto | undefined): CreateGradeDto {
    if (dto === undefined) {
      throw new BadRequestException('Envía los datos de la nota.');
    }

    const title = typeof dto.title === 'string' ? dto.title.trim() : '';
    const type = typeof dto.type === 'string' ? dto.type.trim() : '';

    if (!Number.isInteger(dto.subjectId)) {
      throw new BadRequestException('Selecciona una materia.');
    }

    if (title === '') {
      throw new BadRequestException('El título es obligatorio.');
    }

    if (type === '') {
      throw new BadRequestException('El tipo es obligatorio.');
    }

    if (!Number.isFinite(dto.value) || dto.value < 0 || dto.value > 5) {
      throw new BadRequestException('La nota debe estar entre 0 y 5.');
    }

    if (!Number.isInteger(dto.percentage) || dto.percentage < 1 || dto.percentage > 100) {
      throw new BadRequestException('El porcentaje debe estar entre 1 y 100.');
    }

    if (typeof dto.date !== 'string' || Number.isNaN(Date.parse(dto.date))) {
      throw new BadRequestException('Ingresa una fecha válida.');
    }

    return {
      date: dto.date,
      percentage: dto.percentage,
      subjectId: dto.subjectId,
      title,
      type,
      value: dto.value,
    };
  }
}
