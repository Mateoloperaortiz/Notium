import { CreateGradeDto } from './dto/create-grade.dto.js';
import { UpdateGradeDto } from './dto/update-grade.dto.js';
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
  public findAllByUserId(userId: number, subjectId?: number): Promise<Grade[]> {
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
  public async findOneByUserId(id: number, userId: number): Promise<Grade> {
    const grade = await this.gradesRepository
      .createQueryBuilder('grade')
      .innerJoin('grade.subject', 'subject')
      .innerJoin('subject.semester', 'semester')
      .where('grade.id = :id', { id })
      .andWhere('semester.userId = :userId', { userId })
      .getOne();

    if (grade === null) {
      throw new NotFoundException('No encontramos la nota que buscas.');
    }

    return grade;
  }

  /** Validates the data and saves a new grade in a subject the user owns. */
  public async create(dto: CreateGradeDto, userId: number): Promise<Grade> {
    GradesService.validate(dto);
    await this.assertSubjectOwned(dto.subjectId, userId);

    const grade = this.gradesRepository.create({
      date: dto.date,
      percentage: dto.percentage,
      subjectId: dto.subjectId,
      title: dto.title.trim(),
      type: dto.type.trim(),
      value: dto.value,
    });

    return this.gradesRepository.save(grade);
  }

  /** Validates and applies the changes to a grade of the user. */
  public async update(id: number, dto: UpdateGradeDto, userId: number): Promise<Grade> {
    const grade = await this.findOneByUserId(id, userId);
    const merged = {
      date: dto.date ?? grade.date,
      percentage: dto.percentage ?? grade.percentage,
      subjectId: dto.subjectId ?? grade.subjectId,
      title: dto.title ?? grade.title,
      type: dto.type ?? grade.type,
      value: dto.value ?? grade.value,
    };

    GradesService.validate(merged);

    if (merged.subjectId !== grade.subjectId) {
      await this.assertSubjectOwned(merged.subjectId, userId);
    }

    grade.date = merged.date;
    grade.percentage = merged.percentage;
    grade.subjectId = merged.subjectId;
    grade.title = merged.title.trim();
    grade.type = merged.type.trim();
    grade.value = merged.value;

    return this.gradesRepository.save(grade);
  }

  /** Deletes a grade of the user. */
  public async remove(id: number, userId: number): Promise<void> {
    const grade = await this.findOneByUserId(id, userId);

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

  /** Throws the first validation message in Spanish; returns nothing when the data is valid. */
  private static validate(dto: CreateGradeDto): void {
    if ((dto.title?.trim() ?? '') === '') {
      throw new BadRequestException('El título es obligatorio.');
    }

    if ((dto.type?.trim() ?? '') === '') {
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
  }
}
