import { StatusSemester } from './enums/status-semester.enum.js';
import { CreateSemesterDto } from './dto/create-semester.dto.js';
import { UpdateSemesterDto } from './dto/update-semester.dto.js';
import { Semester } from './entities/semester.entity.js';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/** Reads and writes the semesters of a student and validates their data. */
@Injectable()
export class SemestersService {
  public constructor(
    @InjectRepository(Semester)
    private readonly semestersRepository: Repository<Semester>,
  ) {}

  /** Returns the semesters that belong to the user of the session. */
  public findAllByUserId(userId: number): Promise<Semester[]> {
    return this.semestersRepository.find({ where: { userId } });
  }

  /** Returns one semester of the user; throws 404 if it does not exist or is another user's. */
  public async findOneByUserId(id: number, userId: number): Promise<Semester> {
    const semester = await this.semestersRepository.findOneBy({ id });

    if (semester === null || semester.userId !== userId) {
      throw new NotFoundException('No encontramos el semestre que buscas.');
    }

    return semester;
  }

  /** Validates the data and saves a new semester for the user. */
  public async create(dto: CreateSemesterDto, userId: number): Promise<Semester> {
    SemestersService.validate(dto);

    const semester = this.semestersRepository.create({
      name: dto.name.trim(),
      period: dto.period,
      status: dto.status,
      userId,
      year: dto.year,
    });

    return this.semestersRepository.save(semester);
  }

  /** Validates and applies the changes to a semester of the user. */
  public async update(id: number, dto: UpdateSemesterDto, userId: number): Promise<Semester> {
    const semester = await this.findOneByUserId(id, userId);
    const merged = {
      name: dto.name ?? semester.name,
      period: dto.period ?? semester.period,
      status: dto.status ?? semester.status,
      year: dto.year ?? semester.year,
    };

    SemestersService.validate(merged);

    semester.name = merged.name.trim();
    semester.period = merged.period;
    semester.status = merged.status;
    semester.year = merged.year;

    return this.semestersRepository.save(semester);
  }

  /** Deletes a semester of the user; its subjects and grades go in cascade. */
  public async remove(id: number, userId: number): Promise<void> {
    const semester = await this.findOneByUserId(id, userId);

    await this.semestersRepository.remove(semester);
  }

  /** Throws the first validation message in Spanish; returns nothing when the data is valid. */
  private static validate(dto: CreateSemesterDto): void {
    const name = dto.name?.trim() ?? '';

    if (name.length === 0) {
      throw new BadRequestException('Escribe un nombre para identificar el semestre.');
    }

    if (name.length > 80) {
      throw new BadRequestException('El nombre no puede superar los 80 caracteres.');
    }

    if (!Number.isInteger(dto.year) || dto.year < 2000) {
      throw new BadRequestException('Ingresa un año válido.');
    }

    if (!Number.isInteger(dto.period) || dto.period < 1 || dto.period > 2) {
      throw new BadRequestException('El periodo debe ser 1 o 2.');
    }

    if (!Object.values(StatusSemester).includes(dto.status)) {
      throw new BadRequestException('Selecciona un estado para el semestre.');
    }
  }
}
