
# AGENTS.md

Reglas para agentes de código (Claude Code, Codex, Cursor u otros) que trabajen en este repositorio. Provienen de las presentaciones y tutoriales del curso **Desarrollo Web (EAFIT, 2026-2, prof. Daniel Correa)**, que define una "dictadura" de estándares: no basta con que el programa funcione, debe estar construido con los patrones acordados en clase. El código generado con IA que no los siga, o que el equipo no pueda explicar, se penaliza.

**Prioridad ante conflicto:** (1) instrucción explícita del equipo, (2) este archivo, (3) patrones ya presentes en el repositorio, (4) buenas prácticas genéricas. Si un caso no está cubierto, replica el patrón existente más cercano en lugar de inventar uno nuevo.

**Etiquetas de origen** (para justificar decisiones en la sustentación): `[P01]` Presentación del curso · `[P03]` Intro MPA/SSR · `[P04]` Fundamentos MPA/SSR · `[P05]` Intro SPA/CSR · `[P06]` Fundamentos SPA/CSR · `[P07]` Elementos avanzados SPA/CSR · `[P10]` Intro APIs REST · `[P11]` Intro FullStack · `[T01]`–`[T08]` Tutoriales 01 a 08.

---

## 1. Contexto del proyecto

- Proyecto semestral en equipo tipo "Dashboard": aplicación de seguimiento de notas académicas. Actores: **Estudiante** y **Administrador**. Modelos de dominio: `User`, `Semester`, `Subject`, `Grade`.
- Estructura del repositorio:

```
/
├── frontend/            Vue 3 + TypeScript + Vite + Vue Router + Pinia + Tailwind
├── backend/             Nest.js (ESM) + TypeORM + SQLite
└── docker-compose.yml
```

- Requisitos de la Entrega 1 que el proyecto debe seguir cumpliendo (no eliminar la funcionalidad que los cubre):
  - Entre 7 y 14 páginas (Home, Login y mínimo 5 del sistema); mínimo 2 páginas solo para administradores.
  - Mínimo 2 páginas con selectores de filtrado + tabla + gráfica.
  - Mínimo 2 componentes reutilizables y mínimo 2 CRUDs.
  - Todas las clases del diagrama de clases implementadas.
  - Chart.js (obligatoria) y DataTables.
  - Datos ficticios sembrados en la primera carga.
  - `README.md` en la raíz y página de wiki con pantallazos enlazada desde la principal.
  - Principios DRY y ETC (*The Pragmatic Programmer*).

## 2. Comandos

| Proyecto      | Acción                                                  | Comando                  |
| ------------- | -------------------------------------------------------- | ------------------------ |
| `frontend/` | Servidor de desarrollo (`http://localhost:5173`)       | `npm run dev`          |
| `frontend/` | Build de producción (incluye chequeo de tipos)          | `npm run build`        |
| `frontend/` | Formatear                                                | `npm run format`       |
| `frontend/` | Linter                                                   | `npm run lint`         |
| `backend/`  | Servidor en modo escucha (`http://localhost:3000/api`) | `npm run start:dev`    |
| `backend/`  | Build                                                    | `npm run build`        |
| `backend/`  | Formatear                                                | `npm run format`       |
| `backend/`  | Linter (oxlint)                                          | `npm run lint`         |
| raíz         | Levantar todo con Docker                                 | `docker compose up -d` |

Una tarea no está terminada hasta que `format`, `lint` y `build` pasan sin errores en cada proyecto modificado. [P06][T03][T06]

## 3. Reglas generales (todo el código TypeScript)

### 3.1 Consistencia

- Un mismo problema se resuelve siempre de la misma forma en todo el repositorio: nombres, exports, modificadores de acceso, paso de datos y generación de IDs. Usar `default` o `public` "algunas veces sí y otras no", o tener dos mecanismos distintos para calcular `nextId`, cuenta como error. [P04][P07]
- Identificadores en inglés, como en todo el material del curso. camelCase para variables, funciones, métodos y propiedades (`category`, nunca `Category`); PascalCase para clases, interfaces, tipos y componentes. Prohibido `Main_Point`, snake_case o mezclas. [P04]
- Nombres que describan el dominio. Prohibidos los contenedores genéricos (`OtherService`, `Helpers`, `Misc`): cada función va en el servicio o util de su entidad o tema. [P07]
- Exports: servicios, utils, DTOs y controladores con export nombrado (`export class BookService`). `export default` solo donde el framework lo espera (router, SFC, clases de configuración como `PiniaConfig`). [P07][T04]
- Modificadores de acceso explícitos en todos los miembros de clase (`public static`, `private static readonly`, `private readonly`). [P07][T07]

### 3.2 Formato

- Prettier es la autoridad: `semi: true`, `singleQuote: true`, `printWidth: 100` en `.prettierrc.json`. [T03]
- Llaves de apertura en la misma línea, indentación uniforme, espacio entre palabra de control y paréntesis (`if (cond) {`). [P04]
- "Espacio para respirar": una línea en blanco entre bloques lógicos, entre métodos y después de los imports. [P04][P07]
- Imports ordenados alfabéticamente, `import type` para lo que solo se usa como tipo y extensión explícita (`.js` para módulos TypeScript en ESM, `.vue` para SFC). [P04][P10][P11]
- Las secciones de un archivo se separan con comentarios cortos en inglés (`// functions`, `// watchers`). No se escriben comentarios que narren lo que el código ya dice. [T05][P11]

### 3.3 Tipado [P04][P06]

- Siempre tipar el dominio: interfaces, modelos, entidades, DTOs y contratos de API.
- Siempre tipar parámetros y retornos de funciones y métodos (servicios, utils, controladores, stores). Los asíncronos retornan `Promise<T>`.
- No tipar lo que TypeScript infiere en variables locales obvias.
- Prohibido `any` (incluidos `req: any`, `res: any`, `viewData: any`). Si el tipo es desconocido, `unknown` y estrechamiento.
- `interface` para describir objetos y contratos (`BookInterface`). `type` para tipos flexibles o compuestos: uniones, literales, `Omit`, `Pick` (`CreateBookDTO`). [P06]

### 3.4 Clases de dominio [P04]

- Si se implementan clases del diagrama de clases: atributos privados, acceso mediante getters y setters, propiedades en camelCase.
- Las búsquedas (`findById`, filtros) no viven en el modelo: van al servicio o repositorio correspondiente.

### 3.5 Principios

- SRP, DRY, bajo acoplamiento y ETC. Si una lógica aparece en dos lugares, se mueve a un servicio o a un util. [P06][P07]

## 4. Frontend (Vue 3)

### 4.1 Arquitectura modular por capas (MVVM) [P07]

| Carpeta         | Contenido                                                                                 | Regla                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `views/`      | Una vista por ruta:`BooksIndexView.vue`, `BooksShowView.vue`, `BooksCreateView.vue` | Pantalla completa, no reutilizable, cargada por el router. Orquesta componentes y llama servicios. |
| `components/` | Componentes hijos reutilizables                                                           | Reciben datos por`props` y notifican al padre con `emit`.                                      |
| `services/`   | `BookService.ts`                                                                        | Única capa que conoce la fuente de datos (store/localStorage o API).                              |
| `interfaces/` | `BookInterface.ts`                                                                      | Contratos de las entidades.                                                                        |
| `dtos/`       | `CreateBookDTO.ts`                                                                      | Datos que viajan entre capas o hacia el backend.                                                   |
| `stores/`     | `bookstore.ts`, `bookseeder.ts`                                                       | Estado global con Pinia.                                                                           |
| `utils/`      | p. ej.`PriceFormatUtil.ts`                                                              | Funciones puras reutilizables agrupadas en clases.                                                 |
| `router/`     | `index.ts`                                                                              | Definición de rutas.                                                                              |

Flujo obligatorio: **View / Component → Service → (Store | API)**. Una vista o componente nunca importa `stores`, `data`, `axios` ni `localStorage` para datos de dominio; si cambia la fuente de datos, ningún componente debe modificarse. [P06][P11]

Si las vistas crecen, se agrupan en subcarpetas por recurso (`views/books/`). [P04]

### 4.2 Single-File Components [P05][T03]

- Composition API con `<script setup lang="ts">`. Options API prohibida.
- Orden de bloques: `<script setup>` y luego `<template>`. Estilos con clases utilitarias de Tailwind; sin CSS propio salvo necesidad real. [P03]
- Orden dentro del script: imports → `// props` (y emits) → `// state` → `// computed` → `// functions` → `// watchers` → `// lifecycle`.
- `defineProps<{ ... }>()` y `defineEmits<{ ... }>()` siempre tipados. Padre → hijo por props; hijo → padre por emit. [P07]
- Navegación interna con `<RouterLink>`; nunca `<a href>` para rutas internas porque recarga la página. [P05]
- `v-for` siempre con `:key`; inputs numéricos con `v-model.number`. [T04][T05]
- El formateo de datos (precios, fechas) se hace con utils, no con funciones repetidas en cada vista. [P07][T05]

### 4.3 Reactividad [P07]

- `const` normal: valores que no cambian o que no afectan la vista.
- `ref`: estado que afecta la interfaz (acceso con `.value` en el script).
- `computed`: solo valores derivados de variables reactivas (p. ej. lista filtrada por un selector). Nunca para llamar APIs, escribir en localStorage ni modificar otras variables.
- `watch`: efectos secundarios cuando algo cambia (llamadas a API, persistencia, validaciones, redirecciones).

### 4.4 Carga de datos y asincronía [P11][T07]

- Los datos se obtienen invocando el servicio dentro de `onMounted(async () => { ... })` y se guardan en un `ref` tipado (`ref<BookInterface | null>(null)`, `ref<BookInterface[]>([])`).
- Prohibido `await` en el nivel superior de `<script setup>`: bloquea la inicialización del componente.
- Toda llamada `await` a un servicio va dentro de `try/catch` en la vista o componente.

### 4.5 Router [P04][P05][T03][T04]

- `src/router/index.ts` con `createWebHistory(import.meta.env.BASE_URL)`.
- Cada ruta declara `path`, `name`, `component` y `meta: { title }`.
- Paths por recurso en plural (`/books`, `/books/create`, `/books/:id`); rutas estáticas antes que las dinámicas.
- Nombres de ruta con un único patrón `recurso.accion` (p. ej. `books.create`); no mezclar estilos.
- Las páginas de administrador se protegen con route guards basados en `meta`.
- Si el archivo crece demasiado, las rutas se separan por módulo.

### 4.6 Pinia [P06][T04][T07]

- Solo Setup Stores; los `ref` definidos en el store son su state:

```ts
export const useBookStore = defineStore('book', () => {
  const books = ref<BookInterface[]>([]);

  return { books };
});
```

- Modo local (sin backend): seeders en `stores/<entidad>seeder.ts`; `PiniaConfig.init()` hidrata el estado desde `localStorage` (clave `piniaState`), siembra en la primera carga y persiste los cambios con `watch(pinia.state, ..., { deep: true })`.
- Modo FullStack: los datos de dominio viven en la API y se consultan por servicios. Los stores quedan para estado global compartido (p. ej. usuario autenticado) y no duplican lo que sirve el backend.

### 4.7 Servicios, interfaces y DTOs [P06][P07][P11][T04][T07][T08]

- Un servicio por entidad, con métodos `public static` tipados y nombrados de forma uniforme: `getBooks()`, `getBookById(id)`, `createBook(dto)`, `updateBook(id, dto)`, `deleteBook(id)`.
- Los métodos de escritura reciben DTOs con nombre; nunca `Omit<...>` en línea ni objetos anónimos en la firma.
- Interfaces: `export interface BookInterface { ... }` en `interfaces/BookInterface.ts`.
- DTOs: `export type CreateBookDTO = Omit<BookInterface, 'id'>;` en `dtos/CreateBookDTO.ts`.
- Modo FullStack: los servicios usan `axios`, retornan `Promise<T>` y toman la URL base de `import.meta.env.VITE_API_BASE_URL`. Nunca `http://localhost:3000` escrito en el código.
- La configuración común (URL base, cliente axios) se centraliza en un `BaseService` para no repetirla en cada servicio. [P11]
- Un único mecanismo de generación de IDs; en modo FullStack lo asigna la base de datos.

### 4.8 Utils [P07]

- Funciones puras: independientes, reutilizables, sin estado propio y sin dependencia de Vue.
- Agrupadas por tema en clases con métodos `public static` (p. ej. `PriceFormatUtil.formatToCOP(price: number): string`).

## 5. Backend (Nest.js)

### 5.1 Estructura [P10][T06][T07]

```
backend/src/
├── main.ts                 prefijo global, CORS y puerto
├── app.module.ts           solo conecta módulos y TypeORM
└── books/
    ├── books.module.ts
    ├── books.controller.ts
    ├── books.service.ts
    ├── entities/book.entity.ts
    └── dto/create-book.dto.ts
```

- Un módulo por conjunto de funcionalidades altamente relacionadas; `AppModule` solo importa módulos.
- Proyecto en ESM: imports relativos con extensión `.js`.
- Archivos en kebab-case con sufijo de rol (`.module.ts`, `.controller.ts`, `.service.ts`, `.entity.ts`, `.dto.ts`).

### 5.2 Controladores [P10]

- Reciben la petición, delegan en el servicio y retornan la respuesta. Sin lógica de negocio ni acceso directo a repositorios.
- Un controlador por recurso, ruta base en plural (`@Controller('books')`).
- Métodos con nombres uniformes: `findAll`, `findOne`, `create`, `update`, `remove` (más consultas específicas como `findByBookId`).
- Verbos REST: `GET` colección, `GET /:id` elemento, `POST` crear, `PUT`/`PATCH` actualizar, `DELETE` eliminar. [P11]
- Retornos tipados (`Promise<Book[]>`, `Promise<Book | null>`); entradas con `@Param` y `@Body` tipadas con DTO.
- `import type` para lo que solo aparece como anotación (p. ej. la entidad en el tipo de retorno). Los servicios inyectados y los DTO de `@Body()` se importan como valor.

### 5.3 Providers [P10]

- La lógica de negocio vive en servicios `@Injectable()`, registrados en `providers` del módulo.
- Dependencias por inyección en el constructor, siempre `private readonly`:

```ts
constructor(
  @InjectRepository(Book)
  private readonly booksRepository: Repository<Book>,
) {}
```

### 5.4 Entidades y TypeORM [P10][P11][T07]

- Entidades en `entities/<entidad>.entity.ts`, registradas en `TypeOrmModule.forFeature([...])` del módulo.
- Relaciones siempre envueltas en `Relation<T>` (importado como tipo) en ambos lados para evitar referencias circulares: `book: Relation<Book>`, `reviews: Relation<Review[]>`.
- En el proyecto el esquema se gestiona con migraciones de TypeORM y con el historial de migraciones activado; `synchronize: true` solo es aceptable en los tutoriales.

### 5.5 DTOs [P06][T06]

- `dto/create-<entidad>.dto.ts` → `export class CreateBookDto`.
- Los DTO controlan qué entra y qué sale: la entidad no se usa como DTO de entrada y nunca se exponen campos sensibles (contraseñas, tokens) en las respuestas.

### 5.6 Configuración [T07][T08]

- `main.ts`: `app.setGlobalPrefix('api')`; CORS con orígenes leídos de `process.env.CORS_ORIGIN` (lista separada por comas) y fallback a orígenes locales; `app.listen(process.env.PORT ?? 3000)`.
- Ruta de la base de datos desde `process.env.SQLITE_PATH ?? 'database.sqlite'`.
- Nunca escribir IPs ni URLs de despliegue en el código.

## 6. Despliegue [T08]

- Docker Compose en una VM de GCP: servicio `backend` (puerto 3000, volumen para SQLite) y servicio `frontend` (puerto 80, `depends_on: backend`).
- Cada proyecto tiene su `.dockerignore` (`node_modules`, `.git`, `.gitignore`, `*.md`; el backend además `coverage`, `test` y `.env*`).
- `frontend/.env` define `VITE_API_BASE_URL`. Vite la incrusta en el build, así que cualquier cambio exige volver a ejecutar `npm run build`.
- No cambiar la estrategia de despliegue (build local o en Dockerfile, SQLite o MySQL) sin que el equipo lo pida.

## 7. Anti-patrones señalados en clase

| No hacer                                                  | Hacer                                       | Origen     |
| --------------------------------------------------------- | ------------------------------------------- | ---------- |
| Misma función copiada en varias vistas (`formatToCOP`) | Método estático en un util                | [T05][P07] |
| Búsqueda o acceso a datos dentro del componente          | Método del servicio                        | [P06]      |
| `axios` invocado desde un SFC                           | Llamada desde el servicio                   | [P11]      |
| `await` en el nivel superior de `<script setup>`      | `onMounted(async () => ...)`              | [P11]      |
| `computed` que invoca un servicio                       | `ref` cargado en `onMounted`            | [P07][T05] |
| `OtherService` con lógica de libros                    | Método en`BookService`                   | [P07]      |
| `Omit<ReviewInterface, 'id'>` en la firma del servicio  | `CreateReviewDTO`                         | [P07][T07] |
| Dos sistemas distintos para calcular`nextId`            | Un único mecanismo                         | [P07]      |
| `default` o `public` usados de forma inconsistente    | Mismo estilo en todos los archivos del tipo | [P07]      |
| `any` en parámetros o variables                        | Tipos explícitos                           | [P04]      |
| `Main_Point`, `Category`, rutas como `/main-point`  | camelCase y rutas por recurso               | [P04]      |
| Controlador que mezcla recursos                           | Un controlador por recurso                  | [P04]      |
| `<a href="/books">`                                     | `<RouterLink to="/books">`                | [P05]      |
| Options API                                               | Composition API con`<script setup>`       | [P05]      |
| URL de la API escrita en el servicio                      | `VITE_API_BASE_URL` + `BaseService`     | [T08][P11] |
| Relaciones sin`Relation<T>`                             | `Relation<T>` en ambos lados              | [P11]      |
| Imports desordenados o sin extensión                     | Orden alfabético y extensión completa     | [P04][P11] |
| `synchronize: true` en el proyecto                      | Migraciones con historial                   | [P10]      |

## 8. Forma de trabajar del agente

- Antes de crear un archivo, leer los archivos vecinos del mismo tipo y replicar su estructura.
- Cambios pequeños y enfocados. No refactorizar zonas no pedidas; si se detecta una violación de estas reglas fuera del alcance, se reporta en lugar de corregirla en silencio.
- No agregar dependencias, librerías ni patrones no vistos en el curso sin preguntar. Stack aprobado: Vue 3, Vue Router, Pinia, Vite, TypeScript, Tailwind, Font Awesome, Axios, Chart.js, DataTables, Nest.js, TypeORM, better-sqlite3, Docker.
- La nota de cada entrega es NF × NS y la sustentación es individual. Al terminar, resumir qué se cambió, en qué archivos y qué regla de este documento se aplicó, para que cualquier integrante pueda explicarlo. [P01]

### Checklist de cierre

- [ ] `npm run format`, `npm run lint` y `npm run build` sin errores en cada proyecto modificado.
- [ ] Sin `any`; imports ordenados, con `import type` donde aplica y extensiones completas.
- [ ] Ninguna vista o componente accede a datos sin pasar por un servicio.
- [ ] Nada duplicado que debería vivir en un util o servicio.
- [ ] Nombres, exports y modificadores consistentes con el resto del repositorio.
- [ ] Sin URLs, IPs ni credenciales escritas en el código.
