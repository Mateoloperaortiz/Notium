import type { User } from '@/models'
import { BaseRepository } from './base.repository'

class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users')
  }

  findByEmail(email: string): User | null {
    const normalized = email.trim().toLowerCase()
    return this.list().find((user) => user.email.toLowerCase() === normalized) ?? null
  }

  emailExists(email: string, exceptId?: string): boolean {
    const found = this.findByEmail(email)
    return found !== null && found.id !== exceptId
  }
}

export const userRepository = new UserRepository()
