import type { PublicUser, User } from '@/models'
import { userRepository } from '@/repositories'
import { storage } from '@/services/storage.service'
import { hashPassword, verifyPassword } from '@/utils/hash.util'

const SESSION_COLLECTION = 'session'

export interface Credentials {
  email: string
  password: string
}

export type AuthResult = { ok: true; user: PublicUser } | { ok: false; error: string }

/** Autenticacion contra los usuarios ficticios guardados en LocalStorage. */
export class AuthService {
  async login({ email, password }: Credentials): Promise<AuthResult> {
    const user = userRepository.findByEmail(email)
    if (user === null) {
      return { ok: false, error: 'No existe una cuenta con ese correo.' }
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return { ok: false, error: 'La contrasena no es correcta.' }
    }

    this.saveSession(user.id)
    return { ok: true, user: toPublicUser(user) }
  }

  logout(): void {
    storage.remove(SESSION_COLLECTION)
  }

  /** Lee unicamente el id de usuario guardado en la sesion local. */
  getSessionUserId(): string | null {
    return storage.read<string | null>(SESSION_COLLECTION, null)
  }

  /** Recupera la sesion tras recargar la pagina. */
  restoreSession(): PublicUser | null {
    const userId = this.getSessionUserId()
    if (userId === null) {
      return null
    }

    const user = userRepository.findById(userId)
    if (user === null) {
      this.logout()
      return null
    }

    return toPublicUser(user)
  }

  async hash(password: string): Promise<string> {
    return hashPassword(password)
  }

  private saveSession(userId: string): void {
    storage.write(SESSION_COLLECTION, userId)
  }
}

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user
  return publicUser
}

export const authService = new AuthService()
