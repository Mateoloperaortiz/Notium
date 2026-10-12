import type { CreateSemesterDto } from './dto/create-semester.dto.js';
import { Semester } from './entities/semester.entity.js';
import { StatusSemester } from './enums/status-semester.enum.js';
import { SemestersService } from './semesters.service.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('SemestersService', (): void => {
  let repository: Repository<Semester>;
  let service: SemestersService;

  const ownedSemester = (): Semester =>
    ({
      id: 10,
      name: 'Semestre 2026-1',
      period: 1,
      status: StatusSemester.inProgress,
      userId: 1,
      year: 2026,
    }) as Semester;

  const validDto = (): CreateSemesterDto => ({
    name: 'Semestre 2026-1',
    period: 1,
    status: StatusSemester.inProgress,
    year: 2026,
  });

  beforeEach((): void => {
    repository = {
      create: vi.fn((data: Partial<Semester>): Partial<Semester> => data),
      find: vi.fn(),
      findOneBy: vi.fn(),
      remove: vi.fn().mockResolvedValue(undefined),
      save: vi.fn((entity: Semester): Promise<Semester> => Promise.resolve(entity)),
    } as unknown as Repository<Semester>;
    service = new SemestersService(repository);
  });

  it('lists only the semesters of the user', async (): Promise<void> => {
    const semesters = [ownedSemester()];
    vi.mocked(repository.find).mockResolvedValue(semesters);

    await expect(service.findAll(1)).resolves.toBe(semesters);
    expect(repository.find).toHaveBeenCalledWith({ where: { userId: 1 } });
  });

  it('returns one semester of the user', async (): Promise<void> => {
    vi.mocked(repository.findOneBy).mockResolvedValue(ownedSemester());

    await expect(service.findOne(10, 1)).resolves.toMatchObject({ id: 10 });
  });

  it('answers 404 when the semester does not exist', async (): Promise<void> => {
    vi.mocked(repository.findOneBy).mockResolvedValue(null);

    await expect(service.findOne(10, 1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('answers 404 when the semester belongs to another user', async (): Promise<void> => {
    vi.mocked(repository.findOneBy).mockResolvedValue(ownedSemester());

    await expect(service.findOne(10, 2)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a semester for the user', async (): Promise<void> => {
    const created = await service.create(validDto(), 7);

    expect(created).toMatchObject({ name: 'Semestre 2026-1', userId: 7 });
    expect(repository.save).toHaveBeenCalled();
  });

  it('rejects an empty name with 400', async (): Promise<void> => {
    await expect(service.create({ ...validDto(), name: '  ' }, 1)).rejects.toThrow(
      'Escribe un nombre para identificar el semestre.',
    );
  });

  it('rejects an invalid period with 400', async (): Promise<void> => {
    await expect(service.create({ ...validDto(), period: 3 }, 1)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('updates a semester of the user', async (): Promise<void> => {
    vi.mocked(repository.findOneBy).mockResolvedValue(ownedSemester());

    const updated = await service.update(10, { name: 'Nuevo nombre' }, 1);

    expect(updated).toMatchObject({ name: 'Nuevo nombre' });
    expect(repository.save).toHaveBeenCalled();
  });

  it('does not update a semester of another user', async (): Promise<void> => {
    vi.mocked(repository.findOneBy).mockResolvedValue(ownedSemester());

    await expect(service.update(10, { name: 'Nuevo nombre' }, 2)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('removes a semester of the user', async (): Promise<void> => {
    const semester = ownedSemester();
    vi.mocked(repository.findOneBy).mockResolvedValue(semester);

    await service.remove(10, 1);

    expect(repository.remove).toHaveBeenCalledWith(semester);
  });

  it('answers 400 when the body is missing', async (): Promise<void> => {
    await expect(service.create(undefined, 1)).rejects.toThrow('Envía los datos del semestre.');
  });

  it('answers 400 when the name is not text', async (): Promise<void> => {
    const dto = { ...validDto(), name: 123 } as unknown as CreateSemesterDto;

    await expect(service.create(dto, 1)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('answers 404 without querying when the id is not a number', async (): Promise<void> => {
    await expect(service.findOne(Number('abc'), 1)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findOneBy).not.toHaveBeenCalled();
  });
});
