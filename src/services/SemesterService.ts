import { mockSemesters } from '@/data/mockData.js';
import type CreateSemesterDTO from '@/dtos/CreateSemesterDTO.js';
import type SemesterValidationErrorsDTO from '@/dtos/SemesterValidationErrorsDTO.js';
import type UpdateSemesterDTO from '@/dtos/UpdateSemesterDTO.js';
import Semester from '@/models/Semester.js';

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
    const validatedDto: CreateSemesterDTO = this.validate(dto);
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

    const mergedDto: CreateSemesterDTO = {
      endDate: dto.endDate ?? semester.getEndDate(),
      name: dto.name ?? semester.getName(),
      startDate: dto.startDate ?? semester.getStartDate(),
    };
    const validatedDto: CreateSemesterDTO = this.validate(mergedDto);

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

  public validateFields(dto: CreateSemesterDTO): SemesterValidationErrorsDTO {
    const errors: SemesterValidationErrorsDTO = {
      endDate: '',
      name: '',
      startDate: '',
    };
    const name = dto.name.trim();

    if (name.length === 0) {
      errors.name = 'Escribe un nombre para identificar el semestre.';
    } else if (name.length > 80) {
      errors.name = 'El nombre no puede superar los 80 caracteres.';
    }

    if (dto.startDate.length === 0) {
      errors.startDate = 'Selecciona la fecha de inicio.';
    } else if (!this.isValidIsoDate(dto.startDate)) {
      errors.startDate = 'Ingresa una fecha de inicio válida.';
    }

    if (dto.endDate.length === 0) {
      errors.endDate = 'Selecciona la fecha de finalización.';
    } else if (!this.isValidIsoDate(dto.endDate)) {
      errors.endDate = 'Ingresa una fecha de finalización válida.';
    } else if (errors.startDate === '' && dto.endDate <= dto.startDate) {
      errors.endDate = 'La fecha de finalización debe ser posterior a la fecha de inicio.';
    }

    return errors;
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
    const errors: SemesterValidationErrorsDTO = this.validateFields(dto);
    const firstError = errors.name || errors.startDate || errors.endDate;

    if (firstError !== '') {
      throw new Error(firstError);
    }

    return {
      endDate: dto.endDate,
      name: dto.name.trim(),
      startDate: dto.startDate,
    };
  }
}

export const semesterService: SemesterService = new SemesterService();

export default semesterService;
