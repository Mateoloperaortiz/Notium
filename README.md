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

El despliegue evaluado es una máquina virtual de GCP servida por HTTP. Ambos proyectos se
levantan con `docker-compose.yml` como en el Tutorial 08 (issue #29). GitHub Pages
ya no se usa: la página es HTTPS y el navegador bloquea sus llamadas a una API por HTTP.

La imagen del frontend (`frontend/Dockerfile`) se construye en dos etapas: la primera compila la
SPA con `node:24-alpine` y la segunda la sirve con nginx y la configuración de `nginx.conf` para
rutas de SPA.

Desde la raíz del repositorio, con Docker y el plugin de Compose instalados:

```bash
cp .env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie el secreto generado en `JWT_SECRET` del archivo `.env` y ponga la dirección de la SPA
en `CORS_ORIGIN` (`http://<IP-de-la-VM>` en GCP). Nunca versione este archivo.

```bash
docker compose up --build --wait
docker compose ps
```

La SPA queda en el puerto 80 y la API en el 3000. La imagen de producción sobrescribe
`VITE_API_BASE_URL` con una cadena vacía: axios llama a `/api` en el mismo origen y nginx
reenvía esas peticiones al contenedor `backend:3000`. El `.env` del frontend sigue apuntando a
`localhost:3000` únicamente para el servidor de desarrollo. La imagen no necesita recompilarse
si cambia la IP de la VM. En GCP se permiten TCP 80 y 3000 para la VM; SSH se permite por IAP.

Compose espera a que la API esté saludable antes de arrancar nginx. SQLite se guarda en el
volumen `sqlite-data`, que sobrevive a recrear los contenedores y a apagar la VM. Use
`docker compose down` para detener los contenedores; `docker compose down --volumes` también
borra la base de datos y solo se usa cuando se desea reiniciar los datos de prueba.

El CI verifica ambos proyectos y además construye y levanta las imágenes, comprueba el login
y el perfil autenticado a través de nginx, y elimina sus contenedores y volumen de prueba.

Para una presentación, encienda la VM, consulte su nueva IP temporal y abra `http://<IP>/`:

```bash
gcloud compute instances start notium-demo --project=notium-demo-20260930 --zone=us-central1-c
gcloud compute instances describe notium-demo --project=notium-demo-20260930 --zone=us-central1-c \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

Los contenedores arrancan automáticamente con Docker. Al terminar la presentación:

```bash
gcloud compute instances stop notium-demo --project=notium-demo-20260930 --zone=us-central1-c
```

Una VM apagada deja de cobrar cómputo y libera su IP temporal. El disco conservado puede
seguir generando cargos de almacenamiento. El enlace de la presentación será la IP consultada
después del arranque; los CRUD siguen siendo locales hasta completar los issues #25 a #28.
