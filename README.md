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
npm run lint
npm run build
```

Para comprobar el formato sin modificar archivos:

```bash
npm run format:check
```

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
