import type { BaseEntity, SelectOption } from './base.model'

export const UserRole = {
  Student: 'student',
  Admin: 'admin',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export interface User extends BaseEntity {
  name: string
  email: string
  /** Nunca se guarda la contrasena en claro: solo su hash SHA-256. */
  passwordHash: string
  role: UserRole
}

/** Usuario expuesto a la interfaz, sin el hash de la contrasena. */
export type PublicUser = Omit<User, 'passwordHash'>

export function userRoleLabel(role: UserRole): string {
  switch (role) {
    case UserRole.Student:
      return 'Estudiante'
    case UserRole.Admin:
      return 'Administrador'
    default: {
      const exhaustive: never = role
      return exhaustive
    }
  }
}

export const USER_ROLE_OPTIONS: readonly SelectOption<UserRole>[] = Object.values(UserRole).map(
  (role) => ({ value: role, label: userRoleLabel(role) }),
)
