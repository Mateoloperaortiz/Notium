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

Las credenciales viven en `src/seeders/userseeder.ts` y solo sirven para la demostración local.

| Correo              | Contraseña       | Rol     |
| ------------------- | ---------------- | ------- |
| `mateo@example.com` | `mateo-password` | `user`  |
| `lucia@example.com` | `lucia-password` | `user`  |
| `admin@example.com` | `admin-password` | `admin` |

## Reglas del proyecto

Las reglas de programación están en `AGENTS.md` y se explican en la
[wiki](https://github.com/Mateoloperaortiz/Notium/wiki). Antes de entregar cambios, ejecutar
`npm test` y `npm run check`: ESLint sin advertencias, Prettier, verificación de tipos y
compilación de producción. El workflow `.github/workflows/cicd.yml` ejecuta las pruebas y el mismo
comando en los pushes y pull requests contra `main`.

ESLint exige tipos explícitos en parámetros, retornos y atributos, evita `any`, usa `interface`
para objetos, ordena imports por ruta y comprueba convenciones de Vue, Setup Stores y separación
de la UI respecto a infraestructura. Las variables locales simples pueden mantener inferencia.
Los miembros de cada import también se ordenan alfabéticamente, sin distinguir mayúsculas.

Los módulos TypeScript locales se importan con la extensión `.js` y los componentes con `.vue`.

## Arquitectura

El diagrama de arquitectura está en `docs/diagrams/`: `notium-arquitectura.drawio` es el archivo
editable de draw.io y `notium-arquitectura.png`, su exportación.

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
├── dtos/                   # Contratos de entrada y salida
├── interfaces/             # Entidades del dominio y enumeraciones
├── router/                 # Rutas de la SPA y control de acceso
├── seeders/                # Datos semilla planos, uno por entidad
├── services/               # Lógica de negocio y acceso a datos
├── stores/                 # Estado global en Setup Stores
├── utils/                  # Utilidades puras: IDs, fechas, errores, tablas, analítica y reportes
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

- Entidades `User`, `Semester`, `Subject` y `Grade` como interfaces planas relacionadas solo por
  ID (`userId`, `semesterId`, `subjectId`), con los enums `Role` y `StatusSemester`.
- DTOs de creación, actualización, analítica y reportes de plataforma.
- CRUD completo de semestres, materias y calificaciones, con validación en los servicios.
- Autenticación con `AuthService` (inicio y cierre de sesión) y guards de router: rutas
  protegidas y área `/admin` restringida al rol `admin`.
- `AnalyticsUtil` y cinco gráficas: promedio por semestre y por materia, créditos por
  semestre, distribución por tipo de calificación y cobertura de evaluación.
- Panel de administración con gestión de usuarios y reportes de plataforma.
- Listados con DataTables y stores de Pinia persistidos en `localStorage`.
- Pruebas unitarias de `SemesterService` con Vitest.

No hay backend ni base de datos: el estado vive en el navegador. Para volver a los datos semilla,
borra la clave `piniaStateV2` de `localStorage`.

## Despliegue

El sitio está publicado en <https://mateoloperaortiz.github.io/Notium/>. Cada push a `main`
ejecuta `.github/workflows/cicd.yml`, que instala dependencias, corre las pruebas y
`npm run check`, construye el sitio y lo publica en la rama `gh-pages`.

GitHub Pages sirve el proyecto bajo `/Notium/`, así que el pipeline compila con
`BASE_PATH=/Notium/`. Sin esa variable la base es la raíz, que es lo que necesita la imagen de
Docker. El pipeline también copia `index.html` a `404.html` porque Pages no reescribe rutas: sin
ese archivo, los enlaces directos a rutas del cliente no cargarían la aplicación.

El `Dockerfile` usa una construcción multietapa. La primera etapa parte de `node:24-alpine`,
instala las dependencias con `npm ci` y compila la SPA; la imagen final solo contiene nginx con
los archivos estáticos y la configuración de `nginx.conf` para rutas de SPA. La carpeta `dist/`
no está versionada porque la imagen se compila a partir del código fuente.

```bash
docker build -t notium .
docker run --rm -p 8080:80 notium
```
