# Notium

Aplicación académica para organizar semestres, materias y calificaciones, con autenticación por
roles, analítica visual y un panel de administración.

El repositorio tiene dos proyectos:

- `frontend/`: SPA en Vue 3, TypeScript y Vite.
- `backend/`: API REST en Nest.js con TypeORM y SQLite.

El inicio de sesión ya funciona contra la API con JWT. Los CRUD de semestres, materias, notas y
usuarios pasan a la API en la fase 2 de la Entrega 1 Parte 2 (issues #25 a #28); mientras tanto
siguen leyendo los datos semilla del navegador. Por eso, hasta el issue #27, los usuarios que se
crean, editan o eliminan en `/admin/users` no cambian quién puede iniciar sesión: el login solo
reconoce las cuentas de la API.

## Requisitos

- Frontend: Node.js 22.18 o superior, o 24.12 o superior.
- Backend: Node.js 22.22.3 o superior, o 24.15 o superior (lo exigen Nest CLI y TypeORM).
- npm 11 o superior.

## Ejecución local

Backend, en una terminal:

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

Antes de arrancar, escriba en `backend/.env` un `JWT_SECRET` de al menos 32 caracteres; el
comando para generarlo está en `.env.example`. La API se niega a arrancar sin él.

La API queda en <http://localhost:3000/api>. Al arrancar aplica las migraciones pendientes, así
que la primera vez crea `database.sqlite` con las tablas y los datos de prueba.

Frontend, en otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La SPA queda en <http://localhost:5173> y llama a la API indicada en `frontend/.env`
(`VITE_API_BASE_URL`).

## Verificación

Antes de cada push, dentro de cada proyecto:

```bash
npm test
npm run check
```

En `frontend/`, `npm run check` ejecuta ESLint, Prettier, la verificación de tipos y el build. En
`backend/`, ejecuta Oxlint, Prettier y el build. El workflow `.github/workflows/cicd.yml` repite
lo mismo para los dos proyectos en cada push y pull request contra `main`.

## Usuarios de prueba

Los crea la migración `SeedDemoData` del backend; las contraseñas se guardan con bcrypt.

| Correo              | Contraseña       | Rol     |
| ------------------- | ---------------- | ------- |
| `mateo@example.com` | `mateo-password` | `user`  |
| `lucia@example.com` | `lucia-password` | `user`  |
| `admin@example.com` | `admin-password` | `admin` |

## Reglas del proyecto

Las reglas de programación de los dos proyectos y el contrato de la API están en `AGENTS.md` y se
explican en la [wiki](https://github.com/Mateoloperaortiz/Notium/wiki).

## Arquitectura

Los diagramas de arquitectura (`notium-arquitectura`) y de clases (`notium-clases`) están en
`docs/diagrams/`, cada uno como archivo editable de draw.io y como PNG.

```text
frontend/src/
├── components/             # Piezas reutilizables por dominio
├── dtos/                   # Contratos de entrada y salida
├── interfaces/             # Entidades del dominio y enumeraciones
├── router/                 # Rutas de la SPA y guards
├── services/               # BaseService (axios) y un servicio por entidad
├── stores/                 # Estado global en Setup Stores
├── utils/                  # Utilidades puras
└── views/                  # Pantallas asociadas a rutas

backend/src/
├── auth/                   # Login con JWT, guards y decoradores
├── database/               # Configuración de TypeORM y migraciones
├── home/                   # GET /api
├── users/                  # Entidad y servicio de usuarios
├── semesters/              # Entidad de semestres (el módulo llega en la fase 2)
├── subjects/               # Entidad de materias (el módulo llega en la fase 2)
└── grades/                 # Entidad de notas (el módulo llega en la fase 2)
```

El acceso a datos sigue este flujo:

```text
Vista → Servicio del frontend → API (/api) → Controlador → Servicio de Nest → TypeORM → SQLite
```

## Despliegue

El despliegue evaluado es una máquina virtual de GCP servida por HTTP. Con el backend, ambos
proyectos se levantarán con `docker-compose.yml` como en el Tutorial 08 (issue #29). GitHub Pages
ya no se usa: la página es HTTPS y el navegador bloquea sus llamadas a una API por HTTP.

La imagen del frontend (`frontend/Dockerfile`) se construye en dos etapas: la primera compila la
SPA con `node:24-alpine` y la segunda la sirve con nginx y la configuración de `nginx.conf` para
rutas de SPA.
