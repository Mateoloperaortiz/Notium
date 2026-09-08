# Notium

Base inicial de una aplicación académica para organizar semestres, materias y calificaciones.

Esta etapa implementa completamente el módulo `Semester` sobre datos mock. `Subject`, `Grade` y el
dashboard quedan preparados para que el equipo los desarrolle después con las mismas convenciones.

## Requisitos

- Node.js 22.18 o superior (también compatible con Node.js 24.12 o superior).
- npm 11 o superior.

## Comandos

```bash
npm install
npm run dev
npm run check
```

Para comprobar el formato sin modificar archivos:

```bash
npm run format:check
```

## Cumplimiento de AGENTS.md

Antes de entregar cambios, ejecutar `npm run check`: ESLint sin advertencias, Prettier,
verificación de tipos y compilación de producción. El workflow `.github/workflows/check.yml`
ejecuta el mismo comando en los pushes y pull requests cuando estos archivos estén en GitHub.

ESLint exige tipos explícitos en parámetros, retornos y atributos, evita `any`, usa `interface`
para objetos, ordena imports por ruta y comprueba convenciones de Vue, Setup Stores y separación
de la UI respecto a infraestructura. Las variables locales simples pueden mantener inferencia.
Los miembros de cada import también se ordenan alfabéticamente, sin distinguir mayúsculas.

Los módulos TypeScript locales se importan con `.js`; los recursos conservan `.vue`, `.css`, etc.
Esta convención es compatible con Vite y mantiene consistencia con ESM. La obligación de `.js`
en `AGENTS.md` está formulada específicamente para proyectos Node con ESM.

Los controles automáticos complementan la revisión del checklist de `AGENTS.md`: SRP,
responsabilidades de negocio, contratos DTO y facilidad de mocking requieren revisar el diseño.
Consulta el [resultado de la auditoría](docs/agents-audit.md) para conocer su alcance.

## Arquitectura

```text
src/
├── assets/                 # Estilos y recursos visuales
├── components/             # Piezas reutilizables por dominio
├── data/                   # Infraestructura mock temporal
├── dtos/                   # Contratos de creación y actualización
├── models/                 # Entidades del dominio
├── router/                 # Rutas de la SPA
├── services/               # Acceso a datos y lógica de operaciones
├── stores/                 # Estado verdaderamente global
├── utils/                  # Utilidades puras y reutilizables
└── views/                  # Pantallas asociadas a rutas
```

El acceso a datos sigue este flujo:

```text
View / Component → Service → Mock data
```

Las vistas no dependen de la fuente concreta. Los métodos asíncronos de los servicios permiten
reemplazar los mocks por una API posteriormente sin cambiar el contrato consumido por la UI.

## Alcance actual

- Modelos `User`, `Semester`, `Subject` y `Grade`.
- DTOs base de creación y actualización.
- Usuario y contenido académico mock.
- `SemesterService` con `findAll`, `findById`, `create`, `update` y `delete`.
- Router con dashboard, listado, detalle de semestre y ruta futura de materia.
- Store Pinia de usuario activo mediante Setup Store.
- CRUD de semestres en la interfaz.

Los datos viven en memoria: al recargar la página vuelven a su estado mock inicial. No se implementan
backend, autenticación ni persistencia durante esta etapa.
