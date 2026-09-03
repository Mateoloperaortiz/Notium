import { mockSemesters } from '@/data/mockData';
import type CreateSemesterDTO from '@/dtos/CreateSemesterDTO';
import type UpdateSemesterDTO from '@/dtos/UpdateSemesterDTO';
import Semester from '@/models/Semester';

const generateSemesterId = (): string => globalThis.crypto.randomUUID();

export class SemesterService {
  private readonly generateId: () => string;
  private readonly semesters: Semester[];

  public constructor(
    semesters: Semester[] = mockSemesters,
    generateId: () => string = generateSemesterId,
  ) {
    this.semesters = semesters;
    this.generateId = generateId;
  }

  public async findAll(): Promise<Semester[]> {
    return [...this.semesters];
  }

  public async findById(id: string): Promise<Semester | undefined> {
    return this.semesters.find((semester: Semester): boolean => semester.getId() === id);
  }

  public async create(dto: CreateSemesterDTO): Promise<Semester> {
    const validatedDto = this.validate(dto);
    const semester = new Semester(
      this.generateId(),
      validatedDto.name,
      validatedDto.startDate,
      validatedDto.endDate,
    );

    this.semesters.push(semester);

    return semester;
  }

  public async update(id: string, dto: UpdateSemesterDTO): Promise<Semester | undefined> {
    const semester = await this.findById(id);

    if (semester === undefined) {
      return undefined;
    }

    const validatedDto = this.validate({
      endDate: dto.endDate ?? semester.getEndDate(),
      name: dto.name ?? semester.getName(),
      startDate: dto.startDate ?? semester.getStartDate(),
    });

    semester.setEndDate(validatedDto.endDate);
    semester.setName(validatedDto.name);
    semester.setStartDate(validatedDto.startDate);

    return semester;
  }

  public async delete(id: string): Promise<boolean> {
    const semesterIndex = this.semesters.findIndex(
      (semester: Semester): boolean => semester.getId() === id,
    );

    if (semesterIndex === -1) {
      return false;
    }

    this.semesters.splice(semesterIndex, 1);

    return true;
  }

  private isValidIsoDate(value: string): boolean {
    const normalizedDate = value.slice(0, 10);
    const date = new Date(`${normalizedDate}T00:00:00Z`);

    return (
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === normalizedDate
    );
  }

  private validate(dto: CreateSemesterDTO): CreateSemesterDTO {
    const name = dto.name.trim();

    if (name.length === 0) {
      throw new Error('El semestre debe tener un nombre.');
    }

    if (name.length > 80) {
      throw new Error('El nombre del semestre no puede superar los 80 caracteres.');
    }

    if (!this.isValidIsoDate(dto.startDate) || !this.isValidIsoDate(dto.endDate)) {
      throw new Error('Las fechas del semestre no son válidas.');
    }

    if (dto.endDate <= dto.startDate) {
      throw new Error('La fecha de finalización debe ser posterior a la fecha de inicio.');
    }

    return {
      endDate: dto.endDate,
      name,
      startDate: dto.startDate,
    };
  }
}

export const semesterService = new SemesterService();

export default semesterService;
