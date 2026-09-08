import type {
  CreateSemesterDTO,
  SemesterValidationErrorsDTO,
  UpdateSemesterDTO,
} from '@/dtos/SemesterDTOs.js';
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import { useAuthStore } from '@/stores/AuthStore.js';
import { useSemesterStore } from '@/stores/SemesterStore.js';

const generateSemesterId = (): string => globalThis.crypto.randomUUID();

export class SemesterService {
  public static async findAll(): Promise<SemesterInterface[]> {
    return [...useSemesterStore().semester];
  }

  public static async findAllByCurrentUser(): Promise<SemesterInterface[]> {
    const currentUser = useAuthStore().currentUser;

    if (currentUser === null) {
      return [];
    }

    return useSemesterStore().semester.filter(
      (semester: SemesterInterface): boolean => semester.user.id === currentUser.id,
    );
  }

  public static async findById(id: string): Promise<SemesterInterface | undefined> {
    const semesters = await SemesterService.findAllByCurrentUser();

    return semesters.find((semester: SemesterInterface): boolean => semester.id === id);
  }

  public static async create(dto: CreateSemesterDTO): Promise<SemesterInterface> {
    const validatedDto: CreateSemesterDTO = SemesterService.validate(dto);
    const user = useAuthStore().currentUser;

    if (user === null) {
      throw new Error('No existe un usuario para asociar el semestre.');
    }

    const timestamp = Date.now();
    const semester: SemesterInterface = {
      ...validatedDto,
      createdAt: timestamp,
      id: generateSemesterId(),
      subjects: [],
      updatedAt: timestamp,
      user: user,
    };

    useSemesterStore().semester.push(semester);

    return semester;
  }

  public static async update(
    id: string,
    dto: UpdateSemesterDTO,
  ): Promise<SemesterInterface | undefined> {
    const semester = await SemesterService.findById(id);

    if (semester === undefined) {
      return undefined;
    }

    const mergedDto: CreateSemesterDTO = {
      name: dto.name ?? semester.name,
      period: dto.period ?? semester.period,
      status: dto.status ?? semester.status,
      year: dto.year ?? semester.year,
    };
    const validatedDto: CreateSemesterDTO = SemesterService.validate(mergedDto);

    Object.assign(semester, validatedDto, { updatedAt: Date.now() });

    return semester;
  }

  public static async delete(id: string): Promise<boolean> {
    const semesters = useSemesterStore().semester;
    const semester = await SemesterService.findById(id);
    const semesterIndex = semester === undefined ? -1 : semesters.indexOf(semester);

    if (semesterIndex === -1) {
      return false;
    }

    useSemesterStore().semester.splice(semesterIndex, 1);

    return true;
  }

  public static validateFields(dto: CreateSemesterDTO): SemesterValidationErrorsDTO {
    const errors: SemesterValidationErrorsDTO = {
      name: '',
      period: '',
      status: '',
      year: '',
    };
    const name = dto.name.trim();

    if (name.length === 0) {
      errors.name = 'Escribe un nombre para identificar el semestre.';
    } else if (name.length > 80) {
      errors.name = 'El nombre no puede superar los 80 caracteres.';
    }

    if (!Number.isInteger(dto.year) || dto.year < 2000) {
      errors.year = 'Ingresa un año válido.';
    }

    if (!Number.isInteger(dto.period) || dto.period < 1 || dto.period > 2) {
      errors.period = 'El periodo debe ser 1 o 2.';
    }

    if (!dto.status) {
      errors.status = 'Selecciona un estado para el semestre.';
    }

    return errors;
  }

  private static validate(dto: CreateSemesterDTO): CreateSemesterDTO {
    const errors: SemesterValidationErrorsDTO = SemesterService.validateFields(dto);
    const firstError = errors.name || errors.year || errors.period || errors.status;

    if (firstError !== '') {
      throw new Error(firstError);
    }

    return {
      name: dto.name.trim(),
      period: dto.period,
      status: dto.status,
      year: dto.year,
    };
  }
}
