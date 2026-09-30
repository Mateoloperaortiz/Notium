# AGENTS.md — Notium

Reglas para agentes de código (Claude Code, Codex, Cursor u otros) que trabajen en este repositorio. Provienen de las presentaciones y tutoriales del curso **Desarrollo Web (EAFIT, 2026-2, prof. Daniel Correa)** y de sus observaciones a la Entrega 1 Parte 1 de Notium (nota 4,05). El curso define una "dictadura" de estándares: no basta con que el programa funcione, debe estar construido con los patrones acordados en clase. El código generado con IA que no los siga, o que el equipo no pueda explicar, se penaliza.

**Prioridad ante conflicto:** (1) instrucción explícita del equipo, (2) observaciones del profesor a este repositorio `[E1]`, (3) el resto de este archivo, (4) patrones ya presentes en el código, (5) buenas prácticas genéricas. Si un caso no está cubierto, elige la solución más simple que siga un patrón visto en clase.

**Etiquetas de origen:** `[E1]` observación del profesor a la Entrega 1 de Notium · `[P01]` Presentación del curso · `[P04]` Fundamentos MPA/SSR · `[P05]` Intro SPA/CSR · `[P06]` Fundamentos SPA/CSR · `[P07]` Elementos avanzados SPA/CSR · `[P10]` Intro APIs REST · `[P11]` Intro FullStack · `[T01]`–`[T08]` Tutoriales 01 a 08.

---

## 1. Contexto del proyecto

- Notium es una SPA para organizar semestres, materias y notas. Actores: **Estudiante** (`Role.User`) y **Administrador** (`Role.Admin`). Entidades: `User`, `Semester`, `Subject`, `Grade`.
- Etapa actual: Entrega 1 Parte 2, proyecto FullStack. `frontend/` es la SPA en Vue y `backend/` la API REST en Nest.js con SQLite. El login ya usa la API; los seeders y los stores de entidades del frontend se reemplazan por la API en la fase 2 (issues #25 a #28). Mientras tanto, `PiniaConfig` sigue persistiendo el estado en `localStorage` (clave `piniaStateV2`).
- Las secciones 3 a 8 son las reglas del frontend: sus rutas (`src/...`) son relativas a `frontend/`. La sección 10 reúne las reglas del backend y de la conexión entre ambos.
- Estructura:

```
/
├── frontend/                     SPA en Vue 3 (Vite)
│   ├── src/
│   │   ├── assets/main.css         variables CSS y estilos globales
│   │   ├── components/<dominio>/   admin, common, grade, graphs, semester, subject
│   │   ├── dtos/                   <Entidad>DTOs.ts
│   │   ├── interfaces/             <Entidad>Interface.ts (con sus enums: Role, StatusSemester)
│   │   ├── router/                 index.ts (rutas) y accessControl.ts (guards)
│   │   ├── seeders/                <entidad>seeder.ts (se eliminan en la fase 2)
│   │   ├── services/               BaseService.ts y <Entidad>Service.ts
│   │   ├── stores/                 <Entidad>Store.ts
│   │   ├── utils/                  <Tema>Util.ts
│   │   ├── views/<dominio>/        <Entidad><Acción>View.vue
│   │   └── App.vue · main.ts · PiniaConfig.ts
│   ├── .env                        VITE_API_BASE_URL para desarrollo
│   └── Dockerfile · nginx.conf     imagen de la SPA
├── backend/                      API REST en Nest.js (ESM)
│   ├── src/
│   │   ├── <recurso>/              módulo, controlador, servicio, entities/, dto/, enums/, interfaces/
│   │   ├── auth/                   login con JWT, guards y decoradores
│   │   ├── database/               configuración de TypeORM, data-source.ts y migrations/
│   │   └── app.module.ts · main.ts
│   └── .env.example                variables de entorno de la API
├── docs/diagrams/                diagramas de arquitectura y de clases (draw.io)
└── .github/workflows/cicd.yml    CI de ambos proyectos
```

- Requisitos de la Entrega 1 que no se pueden romper: entre 7 y 14 páginas (Home, Login y mínimo 5 del sistema), mínimo 2 páginas solo para administradores, mínimo 2 páginas con selectores + tabla + gráfica, mínimo 2 componentes reutilizables, mínimo 2 CRUDs, Chart.js y DataTables, datos sembrados en la primera carga, `README.md` y wiki con pantallazos.

## 2. Herramientas: qué, cómo, dónde y cuándo `[E1]`

| Herramienta     | Qué hace                                                 | Cómo se ejecuta                                           | Dónde se configura                                         | Cuándo                                     |
| --------------- | -------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------ |
| Vite            | Servidor de desarrollo y build de producción             | `npm run dev` · `npm run build` · `npm run preview`       | `vite.config.ts`                                           | Desarrollo diario; build antes de entregar |
| vue-tsc         | Verifica tipos en `.ts` y `.vue`                         | `npm run type-check` (incluido en `build`)                | `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` | Antes de cada commit                       |
| ESLint          | Detecta errores y malas prácticas sin ejecutar el código | `npm run lint` · `npm run lint:fix`                       | `eslint.config.ts`                                         | Antes de cada commit y en CI               |
| Prettier        | Formatea el código; no corrige lógica                    | `npm run format` · `npm run format:check`                 | `.prettierrc.json`, `.prettierignore`, `.editorconfig`     | Antes de cada commit y en CI               |
| Vitest          | Pruebas unitarias de servicios                           | `npm test`                                                | `src/services/__tests__/`                                  | Al cambiar un servicio y en CI             |
| `npm run check` | Lint + formato + build en un solo paso                   | `npm run check`                                           | `package.json`                                             | Antes de cada push                         |
| GitHub Actions  | Corre pruebas y `check` de `frontend/` y `backend/`      | Automático en push y PR a `main`                          | `.github/workflows/cicd.yml`                               | Cada push                                  |
| Docker + nginx  | Imagen que sirve la SPA compilada                        | `docker build -t notium .` · `docker run -p 80:80 notium` | `Dockerfile`, `nginx.conf`, `.dockerignore`                | Al desplegar en la VM de GCP               |

Los comandos de esta tabla se ejecutan dentro de `frontend/`. Las herramientas del backend se ejecutan dentro de `backend/`:

| Herramienta     | Qué hace                                                 | Cómo se ejecuta                                                                                                         | Dónde se configura                       | Cuándo                                  |
| --------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------------- |
| Nest CLI        | Compila y levanta la API                                 | `npm run start:dev` · `npm run build` · `npm run start:prod`                                                            | `nest-cli.json`, `tsconfig*.json`        | Desarrollo diario; build antes del push |
| Oxlint          | Detecta errores sin ejecutar el código; falla con avisos | `npm run lint`                                                                                                          | `oxlint.json`                            | Antes de cada commit y en CI            |
| Prettier        | Formatea el código                                       | `npm run format` · `npm run format:check`                                                                               | `.prettierrc`                            | Antes de cada commit y en CI            |
| Vitest          | Pruebas unitarias de servicios y guards                  | `npm test`                                                                                                              | `vitest.config.ts`, archivos `*.spec.ts` | Al cambiar un servicio y en CI          |
| TypeORM CLI     | Genera, aplica y revierte migraciones                    | `npm run migration:generate -- src/database/migrations/<Nombre>` · `npm run migration:run` · `npm run migration:revert` | `src/database/data-source.ts`            | Cada vez que cambia una entidad         |
| `npm run check` | Oxlint + formato + build en un solo paso                 | `npm run check`                                                                                                         | `package.json`                           | Antes de cada push                      |

Una tarea no está terminada hasta que `npm test` y `npm run check` pasan sin errores.

## 3. Reglas generales

### 3.1 Simplicidad ante todo `[E1]`

- La solución correcta es la más simple que cumple el requisito con los patrones vistos en clase. El profesor penalizó explícitamente la sobreingeniería.
- No agregar capas, abstracciones, librerías, configuraciones ni scripts que no se hayan visto en clase o que el requisito no pida. Antes de crear un archivo nuevo, preguntar si un archivo existente ya puede hacer ese trabajo.
- Ejemplos de lo que se señaló: un grafo de seeders con referencias circulares que obligó a instalar `flatted`, `async/await` en servicios que leen memoria, `crypto.randomUUID()` para IDs y un diagrama generado por script.

### 3.2 Un archivo, una clase; nada de código suelto `[E1]`

- Un archivo que define una clase contiene únicamente esa clase: sin funciones, constantes, interfaces ni llamadas a nivel de módulo.
- Una función auxiliar es un método `private static` de la clase. Una constante que usa un solo método se declara dentro de ese método; si la usan varios métodos, es un miembro `private static readonly`.
- Los tipos auxiliares van en `interfaces/` o `dtos/`, no en el archivo de la clase.

### 3.3 Consistencia `[P04][P07]`

- Un mismo problema se resuelve siempre igual en todo el repositorio: nombres, exports, modificadores, comentarios y generación de IDs.
- Identificadores en inglés; camelCase para variables, funciones, métodos y propiedades; PascalCase para clases, interfaces, tipos y componentes. Textos visibles para el usuario en español.
- Exports nombrados para servicios, utils y stores (`export class GradeService`). `export default` solo para `router/index.ts`, `PiniaConfig` y los SFC.
- Modificadores de acceso explícitos en todos los miembros de clase (`public static`, `private static`).
- Nada de contenedores genéricos (`OtherService`, `Helpers`, `Misc`). `[P07]`

### 3.4 Comentarios `[E1]`

- Solo en archivos `.vue`, siempre en inglés, con este vocabulario fijo y en este orden. Se escriben únicamente las secciones que existen, cada una precedida por una línea en blanco (salvo la primera):

```ts
// Internal imports
// External imports
// Props
// Emits
// State
// Computed
// Functions
// Watchers
// Lifecycle
```

- Prohibidas las variantes (`// View state`, `// Estado de la vista`, `// Form handlers`, `// Data loading`, `// Imports internos`…) y los comentarios que narran lo que el código ya dice.
- Los archivos `.ts` no llevan comentarios de sección.
- Decisión del equipo: los archivos `.ts` de `src/` documentan cada clase, interfaz, `type`, `enum`, store, seeder y método con un comentario TSDoc de una sola línea en inglés (`/** ... */`) que dice para qué sirve o por qué existe, sin repetir el nombre. En las interfaces solo se comentan las propiedades cuya unidad, rango o formato no es obvio (`percentage`, `createdAt`). Dentro de los métodos no se comenta línea por línea.
- Un comentario `//` fuera de los comentarios de sección solo se usa para explicar un porqué que el código no muestra, como el registro único de librerías en `main.ts`.

### 3.5 Formato e imports `[P04][P10][P11][T03]`

- Prettier manda: `semi: true`, `singleQuote: true`, `printWidth: 100`.
- "Espacio para respirar": línea en blanco entre bloques lógicos y entre métodos.
- Imports ordenados alfabéticamente por ruta (lo verifica ESLint), `import type` para lo que solo es tipo, extensión `.js` en módulos TypeScript locales y `.vue` en componentes.

### 3.6 Tipado `[P06]`

- Siempre tipar el dominio (interfaces, DTOs, enums) y las firmas de funciones y métodos (parámetros y retorno), `defineProps` y `defineEmits`.
- No se tipa lo que TypeScript infiere: variables locales obvias y parámetros de callbacks en `map`, `filter`, `find`, `reduce` o `sort`.
- Prohibido `any`; si el tipo es desconocido, `unknown` y estrechamiento.
- `interface` para objetos y contratos; `type` para uniones, literales y tipos derivados (`Omit`, `Partial`).
- Nota: `eslint.config.ts` exige hoy tipos explícitos en todos los callbacks y sus mensajes citan secciones de la versión anterior de este archivo. Mientras no se ajuste en una tarea aparte aprobada por el equipo, se respeta lo que exige el linter; no se modifica la configuración de ESLint como efecto secundario de otra tarea.

### 3.7 Identificadores `[E1][T04][T05]`

- Los IDs son `number` y se generan con un único mecanismo: el máximo existente más uno, implementado una sola vez en `IdUtil.getNextId()`.
- Prohibido `crypto.randomUUID()` y cualquier API que exija contexto seguro (HTTPS): el despliegue evaluado corre sobre HTTP y ahí esa API no existe, por eso crear datos falló en producción.

## 4. Datos locales: interfaces, seeders, stores y PiniaConfig

### 4.1 Interfaces `[E1][P06]`

- Una interfaz describe una entidad plana. Las relaciones son solo IDs (`userId`, `semesterId`, `subjectId`): nunca objetos anidados ni arreglos de hijos.
- Solo tipos que sobreviven a JSON, porque todo termina en `localStorage`: fechas como `string` ISO y marcas de tiempo como `number`.
- Los enums de una entidad viven en su archivo de interfaz.

```ts
export interface GradeInterface {
  id: number;
  subjectId: number;
  title: string;
  value: number;
  percentage: number;
  type: string;
  date: string;
  createdAt: number;
  updatedAt: number;
}
```

### 4.2 Seeders `[E1][T04]`

- Un archivo por seeder en `src/seeders/<entidad>seeder.ts`, que exporta un arreglo literal tipado con la interfaz. Las relaciones se escriben como IDs literales.
- Sin funciones, sin imports entre seeders, sin archivos intermedios de datos: `src/data/` no debe existir. "No jugar a ser un ORM de relaciones."

```ts
import type { SubjectInterface } from "@/interfaces/SubjectInterface.js";

export const subjectSeeder: SubjectInterface[] = [
  {
    id: 1,
    semesterId: 1,
    code: "SI2001",
    name: "Desarrollo Web",
    credits: 3,
    professor: "Daniel Correa",
    createdAt: 1768809600000,
    updatedAt: 1768809600000,
  },
];
```

### 4.3 Stores `[E1][P06]`

- Setup Stores (`defineStore('<id>', () => { ... })`); el id es el nombre de la entidad en singular y la colección del state va en plural: `users`, `semesters`, `subjects`, `grades`.
- El store solo guarda estado; la lógica va en los servicios. Sin interfaces auxiliares para tipar el retorno del store.
- `AuthStore` guarda el token de la API (`token`) y el usuario en sesión (`loggedUser`, sin contraseña). Solo los servicios lo leen o escriben; vistas y guards usan `AuthService.getLoggedUser()`.

### 4.4 PiniaConfig `[T04]`

- Las claves del estado inicial coinciden con el id del store y el nombre de su colección (`subject: { subjects: subjectSeeder }`).
- Serializa con `JSON.stringify` y `JSON.parse`; con interfaces planas no se necesita `flatted`.

## 5. Servicios `[E1][P06][P07]`

- Un servicio por entidad; es la única capa que lee y escribe los stores.
- Los servicios que leen stores locales son síncronos: sin `async`, `await` ni `Promise`, porque leen memoria. Los que llaman a la API son asíncronos (sección 10.5).
- Nombres de métodos con el patrón del curso: `getGrades()`, `getGradeById(id)`, `getGradesBySubjectId(subjectId)`, `createGrade(dto)`, `updateGrade(id, dto)`, `deleteGrade(id)`. El nombre dice qué entidad devuelve y en qué cantidad.
- Los servicios no deciden quién puede ver qué: no leen el usuario en sesión para filtrar ni para negar acceso. Reciben lo que necesitan por parámetro (`getSemestersByUserId(userId)`). Los guards del router controlan la autenticación y el rol; las vistas, incluidas las de detalle, buscan los registros solo dentro de los datos del usuario en sesión y muestran el estado "no encontrado" si el registro no le pertenece.
- `AuthService` expone `login(dto)` (asíncrono, contra `POST /api/auth/login`), `logout()` y `getLoggedUser()` (síncrono, lee `AuthStore`). Vistas y componentes obtienen el usuario en sesión con `getLoggedUser()`, nunca importando `AuthStore`.
- Las relaciones se resuelven consultando por ID, no sincronizando arreglos en ambos lados. Las consultas que cruzan entidades reciben las entidades padre ya obtenidas: `SubjectService.getSubjectsBySemesters(semesters)`, `GradeService.getGradesBySubjects(subjects)`.
- Las dependencias entre servicios van en una sola dirección, de padre a hijo: `AuthService` → `UserService` → `SemesterService` → `SubjectService` → `GradeService`. Un servicio nunca importa a su padre.
- Borrar un registro borra sus hijos (usuario → semestres → materias → notas). Sin esto, un ID reutilizado por `máximo + 1` heredaría registros huérfanos.
- La validación de datos de entrada vive en el servicio (`validateFields`).
- Un servicio accede a datos. Una clase que solo calcula sobre datos que ya recibió (promedios, series, reportes) es un util, no un servicio: por eso esos cálculos viven en `AnalyticsUtil` y `PlatformReportUtil`.

## 6. Utils `[E1][P07]`

- Clases con métodos `public static`, sin constructor, sin estado y sin dependencia de Vue.
- Las constantes que usa un método van dentro de ese método (p. ej. el mapa de escapes HTML dentro de `escapeHtml`).
- Todo cálculo que hoy aparece repetido en varios componentes (promedios en las gráficas, formato de fechas) se mueve a un util.

## 7. Vistas y componentes

### 7.1 Estructura del SFC `[P05][P07][E1]`

- Composition API con `<script setup lang="ts">`; bloques en orden `<script setup>`, `<template>`, `<style scoped>`.
- El contenido del script sigue el orden de la sección 3.4. `defineProps<{ ... }>()` y `defineEmits<{ ... }>()` se tipan en línea, sin interfaces locales.
- Estado con `ref` y valores derivados con `computed`, como en clase; no usar `reactive` ni `shallowRef`.
- `computed` solo deriva valores; `watch` solo para efectos secundarios (validaciones, redirecciones). `[P07]`

### 7.2 Carga de datos `[E1]`

- Con servicios síncronos, la vista obtiene los datos al declarar su estado: sin `onMounted`, sin `async`, sin `await`, sin `Promise.all` y sin estados de carga para datos locales.
- Tras crear, editar o eliminar, la vista vuelve a pedir los datos al servicio y reasigna el `ref`.
- `onMounted` queda solo para lo que necesita el DOM montado (p. ej. dibujar en un `<canvas>`).

```ts
// State
const loggedUserId = AuthService.getLoggedUser()?.id ?? 0;
const semesters = ref<SemesterInterface[]>(
  SemesterService.getSemestersByUserId(loggedUserId),
);

// Functions
function deleteSemester(id: number): void {
  SemesterService.deleteSemester(id);
  semesters.value = SemesterService.getSemestersByUserId(loggedUserId);
}
```

### 7.3 Capas `[P06][P11]`

- Vistas y componentes hablan solo con servicios: nunca importan stores, seeders ni `localStorage`.
- Vistas en `views/<dominio>/`, una por ruta; componentes reutilizables en `components/<dominio>/`, con comunicación por props y emits. `[P07]`

### 7.4 Librerías

- Chart.js se usa de una sola forma en todo el proyecto (a través de `vue-chartjs`) y DataTables mediante `datatables.net-vue3`.
- El registro de librerías (`ChartJS.register`, `DataTable.use`) se hace una sola vez en `main.ts`, no en cada vista o componente.

### 7.5 Estilos

- CSS propio: variables y estilos globales en `assets/main.css`, estilos del componente en `<style scoped>`. El proyecto no usa Tailwind; no mezclarlo.

### 7.6 Navegación y sesión `[P05][E1]`

- Navegación interna con `<RouterLink :to="{ name: '...' }">`; nunca `<a href>` para rutas de la SPA.
- La cabecera muestra siempre una acción visible de cerrar sesión (`AuthService.logout()` y redirección a `login`) cuando hay un usuario en sesión.

## 8. Router `[E1][P05][T03][T04]`

- Las vistas se importan de forma estática al inicio de `router/index.ts`, como en clase. Prohibidas las importaciones dinámicas (`component: () => import(...)`).
- Los guards en `router/accessControl.ts` son síncronos: sin `async` ni promesas.
- Cada ruta declara `path`, `name` y `component`; las protegidas usan `meta: { requiresAuth: true }` y las de administrador además `roles: [Role.Admin]`.
- Nombres de ruta con el patrón existente `recurso-accion` (`semester-index`, `semester-show`, `admin-users`); paths en plural.
- Los parámetros de ruta llegan como texto: se convierten con `Number()` antes de pasarlos a un servicio.

## 9. Despliegue `[E1][T08]`

- El despliegue que evalúa el profesor es una VM de GCP que sirve por **HTTP** la imagen del `Dockerfile` (build multietapa y nginx con fallback de SPA). Con el backend, ambos proyectos se levantan con `docker-compose.yml` como en el Tutorial 08 (issue #29). GitHub Pages ya no se usa: la página es HTTPS y el navegador bloquea sus llamadas a una API por HTTP.
- El código debe funcionar sin HTTPS. `localhost` cuenta como contexto seguro y oculta este tipo de errores: para reproducir la VM, servir el build con `npm run preview -- --host` y abrirlo por la IP de la red.
- Antes de cerrar cualquier cambio que toque autenticación o CRUDs, probar sobre el build: iniciar sesión, cerrar sesión, crear, editar y eliminar.
- No cambiar la estrategia de despliegue sin que el equipo lo pida.

## 10. FullStack: backend y conexión con el frontend `[P10][P11][T06][T07][T08]`

### 10.1 Estructura y herramientas del backend `[T06]`

- Proyecto creado con `nest new backend` (npm, ESM), con Prettier (`semi`, `singleQuote`, `printWidth: 100`) y Oxlint (`npm run lint` falla con cualquier aviso; `any` prohibido).
- Un módulo por recurso en `src/<recurso>/`: `<recurso>.module.ts`, `<recurso>.controller.ts`, `<recurso>.service.ts`, `entities/<entidad>.entity.ts`, `dto/create-<entidad>.dto.ts`, `dto/update-<entidad>.dto.ts` y, si hacen falta, `enums/` e `interfaces/`. Archivos en kebab-case; clases en PascalCase con su sufijo (`SemestersController`, `SemestersService`, `CreateSemesterDto`).
- `app.module.ts` solo conecta módulos y la base de datos.
- Imports relativos con extensión `.js` e `import type` para lo que solo es tipo. Modificadores de acceso explícitos y dependencias inyectadas como `private readonly`.
- Cada clase, interfaz, enum y método lleva su comentario TSDoc de una línea en inglés, como en el frontend (sección 3.4).

### 10.2 Controladores y servicios `[P10][T06][T07]`

- El controlador recibe la petición, toma el usuario con `@CurrentUser()`, convierte los parámetros de ruta con `Number()` y delega en el servicio. No tiene lógica ni usa repositorios.
- El servicio es `@Injectable()`, contiene la lógica y la validación, y accede a los datos con `@InjectRepository(Entidad) private readonly <entidades>Repository: Repository<Entidad>`. Sus métodos son asíncronos y devuelven `Promise<T>`.
- Nombres de métodos como en los tutoriales: `findAll`, `findOne`, `create`, `update` y `remove`. Los que trabajan con datos de un estudiante reciben su ID: `findAll(userId)`, `findOne(id, userId)`, `create(dto, userId)`, `update(id, dto, userId)`, `remove(id, userId)`.
- Los DTOs son clases sin decoradores, como en el Tutorial 06. La validación la hace el servicio y responde `BadRequestException` con el mensaje en español.
- Errores con las excepciones de Nest: 400 `BadRequestException` (datos inválidos), 401 `UnauthorizedException` (sin sesión), 403 (lo responde `RolesGuard`), 404 `NotFoundException` (no existe o es de otro usuario) y 409 `ConflictException` (correo repetido).

### 10.3 Entidades, migraciones y datos `[P10][P11][T07]`

- TypeORM con SQLite (`better-sqlite3`). La configuración está una sola vez en `DatabaseConfig` y la usan la API y la CLI.
- Relaciones con `Relation<T>` en ambos lados. El lado hijo usa `@ManyToOne(..., { onDelete: 'CASCADE' })` y `@JoinColumn({ name: 'userId' })`, y declara la clave foránea como columna (`@Column() userId: number`) para que el JSON la traiga sin cargar la relación. Las respuestas no incluyen relaciones anidadas.
- `synchronize: false`. El esquema se maneja con migraciones y su historial (tabla `migrations`), como pide la presentación 10-A: al cambiar una entidad se genera una migración nueva y nunca se edita una que ya esté en `main`. La API aplica las pendientes al arrancar (`migrationsRun: true`).
- Los datos de prueba están en la migración `SeedDemoData`. Las contraseñas se guardan con bcrypt y la columna tiene `select: false`: ninguna respuesta incluye una contraseña.
- Los IDs los asigna la base de datos y las fechas `createdAt` y `updatedAt`, TypeORM.

### 10.4 Autenticación y acceso `[P11]`

- Login con JWT según la guía de Nest.js (https://docs.nestjs.com/security/authentication). `AuthGuard` es global: toda ruta exige `Authorization: Bearer <token>` salvo las marcadas con `@Public()`. Las rutas de administrador usan `@Roles(Role.Admin)`, que verifica `RolesGuard`.
- El usuario de una petición sale siempre del token (`@CurrentUser()`), nunca del cuerpo, de la URL ni de un parámetro que envíe el frontend.
- Un estudiante solo ve y modifica sus propios registros: el servicio filtra por el ID del token y responde 404 si el registro es de otro usuario.
- Variables de entorno: `PORT`, `SQLITE_PATH`, `CORS_ORIGIN` y `JWT_SECRET` (obligatoria). En local se copian de `.env.example` a `.env`, que no se versiona.

### 10.5 Frontend conectado a la API `[P11][T07][T08]`

- Los servicios que llaman a la API extienden `BaseService` y piden el cliente con el `getClient()` heredado (`AuthService.getClient()`), que arma axios con `VITE_API_BASE_URL` + `/api` y el token. Nunca se llama a axios desde un SFC ni se escribe la URL en un servicio.
- Esos servicios son asíncronos y devuelven `Promise<T>`. Las vistas cargan sus datos dentro de `onMounted(async () => ...)` con `try/catch` y muestran los errores con `ErrorUtil.getErrorMessage()`. Queda prohibido `await` en el nivel superior de `<script setup>`.
- Los componentes no llaman servicios: la vista carga los datos una vez y se los pasa por props.
- Al terminar la fase 2 se eliminan los seeders, los stores de entidades, `IdUtil` y las cascadas manuales; `AuthStore` es el único store que queda. Las interfaces describen el JSON de la API, así que `createdAt` y `updatedAt` pasan a ser fechas ISO (`string`).

### 10.6 Contrato de la API `[P10]`

Todas las rutas llevan el prefijo `/api`. Estudiante = cualquier usuario con sesión; Admin = `Role.Admin`.

| Método y ruta                   | Acceso     | Respuesta                                                              |
| ------------------------------- | ---------- | ---------------------------------------------------------------------- |
| `GET /`                         | Público    | `'API is running'`                                                     |
| `POST /auth/login`              | Público    | `{ accessToken, user }`; 401 si las credenciales no coinciden          |
| `GET /auth/profile`             | Estudiante | Usuario de la sesión (`id`, `name`, `email`, `role`)                   |
| `GET /users` · `GET /users/:id` | Admin      | Usuarios sin contraseña                                                |
| `POST /users`                   | Admin      | Usuario creado; 409 si el correo ya existe                             |
| `PATCH /users/:id`              | Admin      | Usuario actualizado                                                    |
| `DELETE /users/:id`             | Admin      | 204; borra en cascada sus semestres, materias y notas                  |
| `GET /semesters`                | Estudiante | Semestres del usuario de la sesión                                     |
| `GET /semesters/:id`            | Estudiante | Semestre propio; 404 si no existe o es de otro usuario                 |
| `POST /semesters`               | Estudiante | Semestre creado para el usuario de la sesión                           |
| `PATCH /semesters/:id`          | Estudiante | Semestre actualizado                                                   |
| `DELETE /semesters/:id`         | Estudiante | 204; borra en cascada sus materias y notas                             |
| `GET /subjects`                 | Estudiante | Materias propias; acepta `?semesterId=`                                |
| `GET /subjects/:id`             | Estudiante | Materia propia; 404 si no existe o es de otro usuario                  |
| `POST /subjects`                | Estudiante | Materia creada; el `semesterId` del cuerpo debe ser un semestre propio |
| `PATCH /subjects/:id`           | Estudiante | Materia actualizada                                                    |
| `DELETE /subjects/:id`          | Estudiante | 204; borra en cascada sus notas                                        |
| `GET /grades`                   | Estudiante | Notas propias; acepta `?subjectId=`                                    |
| `GET /grades/:id`               | Estudiante | Nota propia; 404 si no existe o es de otro usuario                     |
| `POST /grades`                  | Estudiante | Nota creada; el `subjectId` del cuerpo debe ser una materia propia     |
| `PATCH /grades/:id`             | Estudiante | Nota actualizada                                                       |
| `DELETE /grades/:id`            | Estudiante | 204                                                                    |
| `GET /reports/platform`         | Admin      | `{ users, semesters, subjects, grades }` para `PlatformReportUtil`     |

- Verbos REST: `GET` colección y `GET /:id`, `POST` crear, `PATCH` actualizar y `DELETE` eliminar.

## 11. Documentación `[E1]`

- Este archivo es el documento de reglas del proyecto. Si cambia una regla, se actualizan en el mismo cambio los mensajes de `eslint.config.ts` que la citan.
- La guía de estilo describe cada herramienta por separado con qué, cómo, dónde y cuándo; la sección 2 es su fuente.
- El diagrama de arquitectura lo dibuja el equipo en draw.io a partir del código real: carpetas, clases y flujo que existen, nada más. El agente no genera ni regenera diagramas; si un cambio altera la estructura, lo reporta para que el equipo actualice el diagrama.

## 12. Anti-patrones

| No hacer                                                                               | Hacer                                                  | Origen     |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------- |
| `src/data/seedData.ts` con un grafo de objetos y referencias circulares                | Un seeder plano por entidad con IDs literales          | [E1]       |
| `flatted` para serializar el estado                                                    | `JSON.stringify` sobre interfaces planas               | [E1]       |
| `subject: SubjectInterface`, `grades: GradeInterface[]` en una interfaz                | `subjectId: number`                                    | [E1]       |
| Colección del store en singular (`subject`, `grade`)                                   | `subjects`, `grades`                                   | [E1]       |
| `crypto.randomUUID()`                                                                  | Máximo existente + 1                                   | [E1]       |
| `async`/`await`/`Promise` en servicios que leen Pinia                                  | Métodos síncronos                                      | [E1]       |
| `findAllByCurrentUser()` que filtra por la sesión                                      | `getSemestersByUserId(userId)` + guards                | [E1]       |
| `findBySubjectId`, `findAll`, `findById`                                               | `getGradesBySubjectId`, `getGrades`, `getGradeById`    | [E1][T04]  |
| Vista o componente que importa `AuthStore`                                             | `AuthService.getLoggedUser()`                          | [E1]       |
| Funciones y constantes sueltas (`generateGradeId`, `EMAIL_PATTERN`, `HTML_ESCAPES`)    | Miembros de la clase o variables dentro del método     | [E1]       |
| `private constructor() {}` en utils                                                    | Clase sin constructor                                  | [E1]       |
| Clase de cálculo puro dentro de `services/`                                            | Util                                                   | [E1][P07]  |
| `onMounted(loadData)` + `Promise.all` para datos locales                               | Inicializar el `ref` con el servicio                   | [E1]       |
| `component: () => import(...)` en el router                                            | Import estático                                        | [E1]       |
| Guards `async`                                                                         | Guards síncronos                                       | [E1]       |
| Comentarios de sección distintos en cada archivo, en dos idiomas o sin línea en blanco | Vocabulario fijo de la sección 3.4                     | [E1]       |
| Sin botón de cerrar sesión                                                             | Logout visible en la cabecera                          | [E1]       |
| `ChartJS.register` / `DataTable.use` en cada archivo                                   | Registro único en `main.ts`                            | [E1]       |
| Promedio calculado en cada gráfica                                                     | Método de un util                                      | [P07]      |
| Diagrama generado por script                                                           | Diagrama del equipo que refleja el código              | [E1]       |
| `any`                                                                                  | Tipos explícitos                                       | [P04]      |
| `<a href="/semesters">`                                                                | `<RouterLink :to="{ name: 'semester-index' }">`        | [P05]      |
| Options API                                                                            | `<script setup lang="ts">`                             | [P05]      |
| Inconsistencias de `default`, `public` o nombres                                       | Mismo estilo en todos los archivos del tipo            | [P07]      |
| `synchronize: true` en TypeORM                                                         | Migraciones con historial                              | [P10]      |
| `userId` tomado del cuerpo o de la URL                                                 | `@CurrentUser()` con el ID del token                   | [P11]      |
| Contraseña en una respuesta o guardada en texto plano                                  | bcrypt y `select: false`                               | [P11]      |
| axios o la URL de la API dentro de un SFC o de un servicio                             | `getClient()` de `BaseService` con `VITE_API_BASE_URL` | [P11][T08] |
| Gráfica o tarjeta que llama a un servicio                                              | La vista carga los datos y los pasa por props          | [P07][P11] |

## 13. Forma de trabajar del agente

- Antes de crear o modificar un archivo, leer los archivos vecinos del mismo tipo y replicar su estructura, salvo que contradiga este documento.
- Cambios pequeños y enfocados. Si se detecta una violación fuera del alcance de la tarea, se reporta en lugar de corregirla en silencio.
- No agregar dependencias sin preguntar. Stack aprobado: Vue 3, Vue Router, Pinia, Vite, TypeScript, Chart.js con `vue-chartjs`, DataTables, axios, Vitest, Docker con nginx; en el backend, Nest.js, TypeORM, `better-sqlite3`, `@nestjs/jwt`, bcrypt, Oxlint y Prettier.
- La nota de cada entrega es NF × NS y la sustentación es individual. Al terminar, resumir qué cambió, en qué archivos y qué regla se aplicó, para que cualquier integrante pueda explicarlo. `[P01]`

### Checklist de cierre

- [ ] `npm test` y `npm run check` pasan en `frontend/` y en `backend/`.
- [ ] Ningún archivo de clase tiene código suelto; utils sin constructor.
- [ ] Servicios síncronos, sin filtros por sesión y con nombres `get…`/`create…`/`update…`/`delete…`.
- [ ] Interfaces con relaciones solo por ID; seeders planos, uno por entidad.
- [ ] Comentarios de sección con el vocabulario fijo y línea en blanco antes de cada uno.
- [ ] Cada clase, interfaz, DTO, store, seeder y método de los `.ts` tiene su comentario TSDoc de una línea en inglés.
- [ ] Ninguna vista o componente importa stores, seeders ni `localStorage`.
- [ ] Nada que exija HTTPS; login, logout y CRUDs probados sobre el build contra la API.
- [ ] Backend: controladores que solo delegan, usuario tomado del token, sin `synchronize: true` y una migración nueva por cada cambio de entidad.
- [ ] Ninguna abstracción, archivo o librería que el requisito no pida.
