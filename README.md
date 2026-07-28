# Notium — Dashboard de seguimiento academico

Notium es una aplicacion web construida con **Vue 3 + TypeScript** que centraliza el proceso
academico de un estudiante: semestres, materias, calificaciones, porcentajes de cada evaluacion,
notas acumuladas y promedios ponderados por creditos.

En esta primera version la "base de datos" vive en el **LocalStorage** del navegador y se llena
automaticamente con datos ficticios la primera vez que se abre la aplicacion.

## Estado del proyecto

El proyecto se construye en tres entregas, una por integrante, cada una en su rama y con su pull
request hacia `main`:

| Integrante              | Usuario            | Entrega                                                     |
| ----------------------- | ------------------ | ----------------------------------------------------------- |
| Mateo Lopera Ortiz      | `Mateoloperaortiz` | Arquitectura: configuracion, capa de datos, sesion y layout |
| Samuel Martinez Arteaga | `SamuelMarti22`    | Nucleo academico: CRUD de semestres, materias y notas       |
| Samuel Llano Madrigal   | `Llano0`           | Analiticas, administracion de usuarios y pruebas end to end |

Esta entrega deja lista la base: modelos, persistencia, semilla de datos, calculos academicos con
pruebas, autenticacion por rol y el layout de la aplicacion.

## Requisitos

- Node.js 20 o superior (probado con Node 24)
- npm 10 o superior

## Como ejecutar el programa

```bash
git clone https://github.com/Mateoloperaortiz/Notium.git
cd Notium
npm install
npm run dev
```

**Ruta principal que se debe invocar:** <http://localhost:5173/>

Esa ruta muestra la pagina `Home`. Para entrar al sistema se usa <http://localhost:5173/login>.

## Cuentas de demostracion

Se crean automaticamente en LocalStorage al abrir la aplicacion. Los botones de la pantalla de
acceso rellenan estas credenciales.

| Rol           | Correo              | Contrasena  |
| ------------- | ------------------- | ----------- |
| Estudiante    | `mateo@notium.dev`  | `notium123` |
| Estudiante    | `samuel@notium.dev` | `notium123` |
| Administrador | `admin@notium.dev`  | `admin123`  |

## Scripts disponibles

| Script                 | Descripcion                                               |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo con recarga en caliente            |
| `npm run build`        | Verificacion de tipos y compilacion para produccion       |
| `npm run preview`      | Sirve la carpeta `dist` generada por `build`              |
| `npm run test`         | Pruebas unitarias de los calculos academicos (Vitest)     |
| `npm run type-check`   | Solo verificacion de tipos (`vue-tsc`)                    |
| `npm run lint`         | ESLint sobre todo el proyecto, sin advertencias toleradas |
| `npm run lint:fix`     | Corrige automaticamente lo que ESLint puede arreglar      |
| `npm run format`       | Formatea el codigo con Prettier                           |
| `npm run format:check` | Verifica el formato sin modificar archivos                |

## Rutas de la aplicacion

| Ruta           | Pagina               | Acceso  |
| -------------- | -------------------- | ------- |
| `/`            | Inicio               | Publico |
| `/login`       | Iniciar sesion       | Publico |
| Cualquier otra | Pagina no encontrada | Publico |

Las rutas privadas se protegen con `meta: { requiresAuth, roles }` y las guardas de
`src/router/guards.ts`; las paginas del estudiante y del administrador llegan en las siguientes
entregas.

## Variables de entorno

Todas las variables viven en `.env` (hay una plantilla en `.env.example`) y se leen unicamente
desde `src/config/env.ts`.

| Variable              | Valor por defecto | Uso                                           |
| --------------------- | ----------------- | --------------------------------------------- |
| `VITE_APP_NAME`       | `Notium`          | Nombre visible de la aplicacion               |
| `VITE_STORAGE_PREFIX` | `notium`          | Prefijo de las claves de LocalStorage         |
| `VITE_SEED_VERSION`   | `1`               | Al cambiarlo se regeneran los datos ficticios |
| `VITE_MAX_GRADE`      | `5`               | Nota maxima de la escala institucional        |
| `VITE_MIN_GRADE`      | `0`               | Nota minima de la escala institucional        |
| `VITE_PASSING_GRADE`  | `3`               | Nota minima para aprobar una materia          |

## Como reiniciar los datos

Los datos ficticios se regeneran de dos maneras:

1. Aumentar `VITE_SEED_VERSION` en `.env` y recargar la pagina.
2. Borrar las claves `notium:*` desde la consola del navegador:
   `Object.keys(localStorage).filter(k => k.startsWith('notium:')).forEach(k => localStorage.removeItem(k))`
   y recargar.

## Arquitectura

```
src/
  assets/        Estilos globales (Tailwind CSS v4)
  components/
    base/        Componentes reutilizables (botones, tarjetas, campos, modales, avisos)
    layout/      Encabezado, navegacion lateral, pie y titulos de pagina
  composables/   Logica reutilizable (coleccion reactiva, avisos, confirmaciones)
  config/        Lectura unica de variables de entorno
  models/        Interfaces y uniones del diagrama de clases
  repositories/  CRUD generico sobre LocalStorage por entidad
  router/        Rutas, nombres tipados y guardas de acceso
  services/      Autenticacion, semilla de datos y calculos academicos
  stores/        Estado global con Pinia
  utils/         Utilidades puras (formato, fechas, hash, colores)
  views/         Una vista por ruta (Single File Components)
```

El flujo de datos es unidireccional: `Vista -> Store (Pinia) -> Repositorio -> StorageService ->
LocalStorage`. Los calculos academicos son funciones puras en `services/academic.service.ts` y
estan cubiertos por pruebas.

## Documentacion

La [guia de estilo](https://github.com/Mateoloperaortiz/Notium/wiki/Guia-de-estilo-de-programacion)
y las [reglas de programacion](https://github.com/Mateoloperaortiz/Notium/wiki/Reglas-de-programacion)
estan en el wiki del repositorio, y las tareas en el
[tablero del proyecto](https://github.com/users/Mateoloperaortiz/projects/9).
