/** Campos comunes a todas las entidades del diagrama de clases. */
export interface BaseEntity {
  id: string
  /** Fecha ISO 8601: LocalStorage solo almacena texto. */
  createdAt: string
  updatedAt: string
}

/** Datos que aporta el usuario al crear una entidad (sin id ni marcas de tiempo). */
export type EntityDraft<T extends BaseEntity> = Omit<T, keyof BaseEntity>

/** Datos que aporta el usuario al editar una entidad. */
export type EntityPatch<T extends BaseEntity> = Partial<EntityDraft<T>>

/** Opcion generica para los selectores y filtros de la interfaz. */
export interface SelectOption<TValue extends string | number = string> {
  value: TValue
  label: string
}
