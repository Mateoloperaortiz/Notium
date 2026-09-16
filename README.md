# Notium

Aplicación académica para organizar semestres, materias y calificaciones, con autenticación por
roles, analítica visual y un panel de administración.

Los módulos `Semester`, `Subject` y `Grade` tienen CRUD completo. Los datos se siembran desde
`src/seeders/` y persisten en el navegador mediante `localStorage`, sin backend.

## Requisitos

- Node.js 22.18 o superior (también compatible con Node.js 24.12 o superior).
- npm 11 o superior.

## Comandos

```bash
npm install
npm run dev
npm test
npm run check
```

Para comprobar el formato sin modificar archivos:

```bash
npm run format:check
```

## Usuarios de prueba

Las credenciales viven en `src/data/seedData.ts` y solo sirven para la demostración local.

| Correo              | Contraseña       | Rol     |
| ------------------- | ---------------- | ------- |
| `mateo@example.com` | `mateo-password` | `user`  |
| `lucia@example.com` | `lucia-password` | `user`  |
| `admin@example.com` | `admin-password` | `admin` |

## Cumplimiento de AGENTS.md

Antes de entregar cambios, ejecutar `npm run check`: ESLint sin advertencias, Prettier,
verificación de tipos y compilación de producción. El workflow `.github/workflows/cicd.yml`
ejecuta las pruebas y el mismo comando en los pushes y pull requests contra `main`.

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
│   ├── admin/              # Formularios del panel de administración
│   ├── common/             # Envoltorios compartidos, como ChartPanel
│   ├── grade/              # Tarjeta y formulario de calificaciones
│   ├── graphs/             # Gráficas de Chart.js por indicador
│   ├── semester/           # Tarjeta y formulario de semestres
│   └── subject/            # Tarjeta y formulario de materias
├── data/                   # Datos semilla de la demostración
├── dtos/                   # Contratos de entrada y salida
├── interfaces/             # Entidades del dominio y enumeraciones
├── router/                 # Rutas de la SPA y control de acceso
├── seeders/                # Estado inicial que consume PiniaConfig
├── services/               # Lógica de negocio y acceso a datos
├── stores/                 # Estado global en Setup Stores
├── utils/                  # Utilidades puras y reutilizables
└── views/                  # Pantallas asociadas a rutas
```

El acceso a datos sigue este flujo:

```text
View / Component → Service → Store (Pinia) → localStorage
```

Las vistas no dependen de la fuente concreta: solo hablan con los servicios. `PiniaConfig` es el
único punto que conoce el navegador, así que sustituir `localStorage` por una API posterior no
cambia el contrato que consume la UI.

## Alcance actual

- Entidades `User`, `Semester`, `Subject` y `Grade` como interfaces, con el enum `Role`.
- DTOs de creación, actualización, analítica y reportes de plataforma.
- CRUD completo de semestres, materias y calificaciones, con validación en los servicios.
- Autenticación con `AuthService` y guards de router: rutas protegidas y área `/admin`
  restringida al rol `admin`.
- `AnalyticsService` y cinco gráficas: promedio por semestre y por materia, créditos por
  semestre, distribución por tipo de calificación y cobertura de evaluación.
- Panel de administración con gestión de usuarios y reportes de plataforma.
- Listados con DataTables y stores de Pinia persistidos en `localStorage`.
- Pruebas unitarias de `SemesterService` con Vitest.

No hay backend ni base de datos: el estado vive en el navegador. Para volver a los datos semilla,
borra la clave `piniaState` de `localStorage`.

## Despliegue

Cada push a `main` ejecuta `.github/workflows/cicd.yml`, que instala dependencias, corre las
pruebas y `npm run check`, construye el sitio y lo publica en la rama `gh-pages`.

El `Dockerfile` usa una construcción multietapa. La primera etapa parte de `node:24-alpine`,
instala las dependencias con `npm ci` y compila la SPA; la imagen final solo contiene nginx con
los archivos estáticos y la configuración de `nginx.conf` para rutas de SPA. La carpeta `dist/`
no está versionada porque la imagen se compila a partir del código fuente.

```bash
docker build -t notium .
docker run --rm -p 8080:80 notium
```
