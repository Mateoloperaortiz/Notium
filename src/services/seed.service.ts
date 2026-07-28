import { env } from '@/config/env'
import {
  gradeRepository,
  semesterRepository,
  subjectRepository,
  userRepository,
} from '@/repositories'
import { storage } from '@/services/storage.service'
import { hashPassword } from '@/utils/hash.util'
import { SEED_USERS } from './seed.data'
import type { SeedSemester, SeedSubject, SeedUser } from './seed.data'

const SEED_FLAG_COLLECTION = 'seed-version'

/**
 * Crea los datos ficticios la primera vez que la aplicacion se abre en un navegador.
 * Subir `VITE_SEED_VERSION` fuerza la regeneracion en todos los clientes.
 */
export class SeedService {
  async ensureSeed(): Promise<void> {
    const installedVersion = storage.read<string | null>(SEED_FLAG_COLLECTION, null)
    if (installedVersion === env.seedVersion) {
      return
    }

    await this.reseed()
  }

  /** Borra los datos actuales y vuelve a crear el juego de datos ficticio. */
  async reseed(): Promise<void> {
    storage.clear()

    for (const seedUser of SEED_USERS) {
      await this.createUserTree(seedUser)
    }

    storage.write(SEED_FLAG_COLLECTION, env.seedVersion)
  }

  private async createUserTree(seedUser: SeedUser): Promise<void> {
    const user = userRepository.create({
      name: seedUser.name,
      email: seedUser.email,
      passwordHash: await hashPassword(seedUser.password),
      role: seedUser.role,
    })

    seedUser.semesters.forEach((seedSemester) => this.createSemesterTree(user.id, seedSemester))
  }

  private createSemesterTree(userId: string, seedSemester: SeedSemester): void {
    const semester = semesterRepository.create({
      name: seedSemester.name,
      year: seedSemester.year,
      period: seedSemester.period,
      status: seedSemester.status,
      userId,
    })

    seedSemester.subjects.forEach((seedSubject) => this.createSubjectTree(semester.id, seedSubject))
  }

  private createSubjectTree(semesterId: string, seedSubject: SeedSubject): void {
    const subject = subjectRepository.create({
      code: seedSubject.code,
      name: seedSubject.name,
      credits: seedSubject.credits,
      professor: seedSubject.professor,
      semesterId,
    })

    seedSubject.grades.forEach((seedGrade) => {
      gradeRepository.create({ ...seedGrade, subjectId: subject.id })
    })
  }
}

export const seedService = new SeedService()
