import type { CreateGradeDto } from './dto/create-grade.dto.js';
import { Grade } from './entities/grade.entity.js';
import { GradesService } from './grades.service.js';
import { Subject } from '../subjects/entities/subject.entity.js';
import { NotFoundException } from '@nestjs/common';
import type { Repository, SelectQueryBuilder } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type QueryBuilderMock = {
  innerJoin: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  andWhere: ReturnType<typeof vi.fn>;
  getMany: ReturnType<typeof vi.fn>;
  getOne: ReturnType<typeof vi.fn>;
};

describe('GradesService', (): void => {
  let gradesRepository: Repository<Grade>;
  let subjectsRepository: Repository<Subject>;
  let service: GradesService;
  let gradesQuery: QueryBuilderMock;
  let subjectsQuery: QueryBuilderMock;

  const createQueryBuilderMock = (): QueryBuilderMock => ({
    andWhere: vi.fn().mockReturnThis(),
    getMany: vi.fn(),
    getOne: vi.fn(),
    innerJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
  });

  const ownedGrade = (): Grade =>
    ({
      date: '2026-03-01',
      id: 30,
      percentage: 20,
      subjectId: 20,
      title: 'Parcial',
      type: 'Parcial',
      value: 4.5,
    }) as Grade;

  const validDto = (): CreateGradeDto => ({
    date: '2026-03-01',
    percentage: 20,
    subjectId: 20,
    title: 'Parcial',
    type: 'Parcial',
    value: 4.5,
  });

  beforeEach((): void => {
    gradesQuery = createQueryBuilderMock();
    subjectsQuery = createQueryBuilderMock();
    gradesRepository = {
      create: vi.fn((data: Partial<Grade>): Partial<Grade> => data),
      createQueryBuilder: vi.fn(
        (): SelectQueryBuilder<Grade> => gradesQuery as unknown as SelectQueryBuilder<Grade>,
      ),
      remove: vi.fn().mockResolvedValue(undefined),
      save: vi.fn((entity: Grade): Promise<Grade> => Promise.resolve(entity)),
    } as unknown as Repository<Grade>;
    subjectsRepository = {
      createQueryBuilder: vi.fn(
        (): SelectQueryBuilder<Subject> => subjectsQuery as unknown as SelectQueryBuilder<Subject>,
      ),
    } as unknown as Repository<Subject>;
    service = new GradesService(gradesRepository, subjectsRepository);
  });

  it('lists the grades of the user', async (): Promise<void> => {
    const grades = [ownedGrade()];
    gradesQuery.getMany.mockResolvedValue(grades);

    await expect(service.findAll(1)).resolves.toBe(grades);
    expect(gradesQuery.where).toHaveBeenCalledWith('semester.userId = :userId', { userId: 1 });
  });

  it('filters the grades by subject when subjectId is given', async (): Promise<void> => {
    gradesQuery.getMany.mockResolvedValue([]);

    await service.findAll(1, 20);

    expect(gradesQuery.andWhere).toHaveBeenCalledWith('grade.subjectId = :subjectId', {
      subjectId: 20,
    });
  });

  it('returns one grade of the user', async (): Promise<void> => {
    gradesQuery.getOne.mockResolvedValue(ownedGrade());

    await expect(service.findOne(30, 1)).resolves.toMatchObject({ id: 30 });
  });

  it("answers 404 when the grade does not exist or is another user's", async (): Promise<void> => {
    gradesQuery.getOne.mockResolvedValue(null);

    await expect(service.findOne(30, 1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a grade in a subject the user owns', async (): Promise<void> => {
    subjectsQuery.getOne.mockResolvedValue({ id: 20 } as Subject);

    const created = await service.create(validDto(), 1);

    expect(created).toMatchObject({ subjectId: 20, title: 'Parcial' });
    expect(gradesRepository.save).toHaveBeenCalled();
  });

  it('does not create a grade in a subject of another user', async (): Promise<void> => {
    subjectsQuery.getOne.mockResolvedValue(null);

    await expect(service.create(validDto(), 1)).rejects.toBeInstanceOf(NotFoundException);
    expect(gradesRepository.save).not.toHaveBeenCalled();
  });

  it('rejects a value out of the 0 to 5 scale with 400', async (): Promise<void> => {
    await expect(service.create({ ...validDto(), value: 6 }, 1)).rejects.toThrow(
      'La nota debe estar entre 0 y 5.',
    );
  });

  it('rejects a percentage out of range with 400', async (): Promise<void> => {
    await expect(service.create({ ...validDto(), percentage: 0 }, 1)).rejects.toThrow(
      'El porcentaje debe estar entre 1 y 100.',
    );
  });

  it('removes a grade of the user', async (): Promise<void> => {
    const grade = ownedGrade();
    gradesQuery.getOne.mockResolvedValue(grade);

    await service.remove(30, 1);

    expect(gradesRepository.remove).toHaveBeenCalledWith(grade);
  });

  it('answers 400 when the body is missing', async (): Promise<void> => {
    await expect(service.create(undefined, 1)).rejects.toThrow('Envía los datos de la nota.');
    expect(gradesRepository.save).not.toHaveBeenCalled();
  });

  it('answers 404 without querying when the id is not a number', async (): Promise<void> => {
    await expect(service.findOne(Number('abc'), 1)).rejects.toBeInstanceOf(NotFoundException);
    expect(gradesQuery.getOne).not.toHaveBeenCalled();
  });
});
