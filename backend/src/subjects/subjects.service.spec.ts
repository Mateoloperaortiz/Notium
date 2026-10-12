import type { CreateSubjectDto } from './dto/create-subject.dto.js';
import { Subject } from './entities/subject.entity.js';
import { SubjectsService } from './subjects.service.js';
import { Semester } from '../semesters/entities/semester.entity.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Repository, SelectQueryBuilder } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('SubjectsService', (): void => {
  let subjectsRepository: Repository<Subject>;
  let semestersRepository: Repository<Semester>;
  let service: SubjectsService;
  let queryBuilder: {
    innerJoin: ReturnType<typeof vi.fn>;
    where: ReturnType<typeof vi.fn>;
    andWhere: ReturnType<typeof vi.fn>;
    getMany: ReturnType<typeof vi.fn>;
    getOne: ReturnType<typeof vi.fn>;
  };

  const ownedSubject = (): Subject =>
    ({
      code: 'SI2001',
      credits: 3,
      id: 20,
      name: 'Desarrollo Web',
      professor: 'Daniel',
      semesterId: 10,
    }) as Subject;

  const validDto = (): CreateSubjectDto => ({
    code: 'SI2001',
    credits: 3,
    name: 'Desarrollo Web',
    professor: 'Daniel',
    semesterId: 10,
  });

  beforeEach((): void => {
    queryBuilder = {
      andWhere: vi.fn().mockReturnThis(),
      getMany: vi.fn(),
      getOne: vi.fn(),
      innerJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
    };
    subjectsRepository = {
      create: vi.fn((data: Partial<Subject>): Partial<Subject> => data),
      createQueryBuilder: vi.fn(
        (): SelectQueryBuilder<Subject> => queryBuilder as unknown as SelectQueryBuilder<Subject>,
      ),
      remove: vi.fn().mockResolvedValue(undefined),
      save: vi.fn((entity: Subject): Promise<Subject> => Promise.resolve(entity)),
    } as unknown as Repository<Subject>;
    semestersRepository = {
      findOneBy: vi.fn(),
    } as unknown as Repository<Semester>;
    service = new SubjectsService(subjectsRepository, semestersRepository);
  });

  it('lists the subjects of the user', async (): Promise<void> => {
    const subjects = [ownedSubject()];
    queryBuilder.getMany.mockResolvedValue(subjects);

    await expect(service.findAll(1)).resolves.toBe(subjects);
    expect(queryBuilder.where).toHaveBeenCalledWith('semester.userId = :userId', { userId: 1 });
  });

  it('filters the subjects by semester when semesterId is given', async (): Promise<void> => {
    queryBuilder.getMany.mockResolvedValue([]);

    await service.findAll(1, 10);

    expect(queryBuilder.andWhere).toHaveBeenCalledWith('subject.semesterId = :semesterId', {
      semesterId: 10,
    });
  });

  it('returns one subject of the user', async (): Promise<void> => {
    queryBuilder.getOne.mockResolvedValue(ownedSubject());

    await expect(service.findOne(20, 1)).resolves.toMatchObject({ id: 20 });
  });

  it("answers 404 when the subject does not exist or is another user's", async (): Promise<void> => {
    queryBuilder.getOne.mockResolvedValue(null);

    await expect(service.findOne(20, 1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a subject in a semester the user owns', async (): Promise<void> => {
    vi.mocked(semestersRepository.findOneBy).mockResolvedValue({ id: 10, userId: 1 } as Semester);

    const created = await service.create(validDto(), 1);

    expect(created).toMatchObject({ name: 'Desarrollo Web', semesterId: 10 });
    expect(subjectsRepository.save).toHaveBeenCalled();
  });

  it('does not create a subject in a semester of another user', async (): Promise<void> => {
    vi.mocked(semestersRepository.findOneBy).mockResolvedValue({ id: 10, userId: 2 } as Semester);

    await expect(service.create(validDto(), 1)).rejects.toBeInstanceOf(NotFoundException);
    expect(subjectsRepository.save).not.toHaveBeenCalled();
  });

  it('rejects invalid credits with 400', async (): Promise<void> => {
    await expect(service.create({ ...validDto(), credits: 0 }, 1)).rejects.toThrow(
      'Los créditos deben ser un número entero mayor que cero.',
    );
  });

  it('removes a subject of the user', async (): Promise<void> => {
    const subject = ownedSubject();
    queryBuilder.getOne.mockResolvedValue(subject);

    await service.remove(20, 1);

    expect(subjectsRepository.remove).toHaveBeenCalledWith(subject);
  });

  it('answers 400 when the semester is missing', async (): Promise<void> => {
    const dto = { ...validDto(), semesterId: undefined } as unknown as CreateSubjectDto;

    await expect(service.create(dto, 1)).rejects.toThrow('Selecciona un semestre.');
    expect(semestersRepository.findOneBy).not.toHaveBeenCalled();
  });

  it('answers 400 when the semester filter is not a number', async (): Promise<void> => {
    await expect(service.findAll(1, Number('abc'))).rejects.toBeInstanceOf(BadRequestException);
    expect(queryBuilder.getMany).not.toHaveBeenCalled();
  });
});
