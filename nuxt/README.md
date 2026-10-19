# Notium con Nuxt — Entregable 2

Aplicación independiente de Nuxt 4 que combina un blog generado durante la compilación,
un catálogo de materias renderizado en el servidor y herramientas ejecutadas en el navegador.
Conserva el tema de Notium y usa CSS propio. No requiere Bootstrap, la API Nest ni la base de
datos de la Entrega 1.

Las tres materias de `server/services/SubjectsService.ts` son datos fijos de demostración con
los campos de la entidad `Subject` de Notium. Esta adaptación permite mostrar la migración
de la lista y el detalle a Nuxt sin consultar SQLite, iniciar sesión ni exponer información
personal. No representa una migración completa de todos los CRUD de la Entrega 1.

## Enlaces de entrega

- Repositorio: [Mateoloperaortiz/Notium](https://github.com/Mateoloperaortiz/Notium).
- Aplicación GCP: [Notium Entregable 2](http://136.71.163.71).
- Instancia: `notium-entregable2`, proyecto `dw-mateo-lopera-2026`, zona `us-central1-c`.

Publicación verificada el 19 de octubre de 2026. Se comprobaron las doce páginas válidas,
la API con tres materias, respuestas 404 y diez recursos CSS y JavaScript por HTTP público.
Pasaron 18 pruebas automatizadas de Nuxt y 63 pruebas de regresión de frontend y backend,
además de tipos, formato y builds. La interfaz se revisó en escritorio y a 390 px de ancho.
El servidor generado pasó su auditoría de dependencias sin vulnerabilidades reportadas.

## Ejecución y verificación

Requiere Node.js y npm compatibles con `package.json`; se recomienda Node.js 24.15 o superior
de la rama 24. Desde este directorio:

```bash
npm ci
npm run dev
```

Desarrollo abre en [http://localhost:3001](http://localhost:3001). Para verificar el proyecto:

```bash
npm run check
npm test
npm run audit:runtime
```

`npm test` ejecuta las pruebas de `tests/` sobre el build generado por `check`. `npm run check` ejecuta Oxlint, Prettier,
verificación de tipos y compilación de producción. La compilación genera las rutas estáticas
del blog y el servidor de Nitro. `audit:runtime` audita las dependencias exactas del servidor
generado, que es lo que se copia a la imagen final. La auditoría del árbol completo de desarrollo
de Nuxt 4.6.2 reportó avisos altos en `braces` y `node-forge` mediante herramientas de compilación.
Estos paquetes no aparecen en `.output/server`; no se aplicó `npm audit fix --force`, que proponía
cambiar de versión de Nuxt. Conviene revisar estos avisos al actualizar las herramientas.
Para ejecutar el resultado:

```bash
npm run build
NODE_ENV=production npm start
```

Producción usa [http://localhost:3000](http://localhost:3000). `PORT` cambia el puerto y
`NITRO_HOST` cambia la interfaz de escucha.

Con Docker y el plugin de Compose instalados, desde `nuxt/`:

```bash
docker compose up --build --wait
docker compose ps
```

La aplicación queda en [http://localhost](http://localhost). El puerto 80 debe estar libre.
`docker compose down` detiene esta aplicación. El nombre de proyecto `notium-entregable2`
mantiene sus contenedores separados del Compose de la Entrega 1.

## Rutas y modos de renderizado

| Ruta                 | Modo | Momento de producir el contenido                                          |
| -------------------- | ---- | ------------------------------------------------------------------------- |
| `/`                  | SSR  | El servidor genera el HTML al recibir la petición.                        |
| `/blog`              | SSG  | El índice se genera durante `npm run build`.                              |
| `/blog/[slug]`       | SSG  | Los tres artículos conocidos se generan durante el build.                 |
| `/subjects`          | SSR  | El servidor obtiene las materias e incluye la lista en el HTML.           |
| `/subjects/[id]`     | SSR  | El servidor obtiene e incluye el detalle; un ID inexistente devuelve 404. |
| `/tools`             | CSR  | El navegador genera el contenido de la página.                            |
| `/tools/calculator`  | CSR  | El navegador valida entradas y calcula la nota requerida.                 |
| `/tools/faq`         | CSR  | El navegador muestra las preguntas y permite desplegar sus respuestas.    |
| `/api/subjects`      | API  | Nitro devuelve las tres materias como JSON.                               |
| `/api/subjects/[id]` | API  | Nitro devuelve una materia como JSON o un error 404.                      |

`nuxt.config.ts` define los modos mediante `routeRules`. La lista explícita de rutas del blog
incluye cada `slug` para comprobar que todas sus páginas se generen durante la compilación.
`prerender: false` evita que las materias y herramientas se conviertan en páginas estáticas.

## Estructura

```text
app/
├── assets/main.css          Estilos propios y diseño adaptable
├── data/posts.ts            Contenido de los tres artículos
├── interfaces/              Contratos del contenido editorial
├── pages/                   Rutas de inicio, blog, materias y herramientas
├── services/                Acceso a artículos y API de materias
├── utils/GradeCalculatorUtil.ts  Cálculo y validación de notas
├── app.vue                  Estructura y navegación compartidas
└── error.vue                Tratamiento visual de errores
server/
├── api/subjects/            Endpoints de lista y detalle
└── services/SubjectsService.ts
shared/interfaces/SubjectInterface.ts
tests/                      Pruebas automatizadas
nuxt.config.ts              Reglas SSG, SSR y CSR y salida node-server
Dockerfile                  Build reproducible y ejecución de Nitro sin root
compose.yaml                Servicio independiente en HTTP, puerto 80
```

## Guía de sustentación

1. Explicar por qué el blog es SSG: su contenido editorial es conocido en la compilación y
   se puede servir como HTML ya generado. Cambiar un artículo requiere un nuevo build.
2. Abrir directamente `/subjects` y revisar el HTML recibido, incluso con JavaScript
   desactivado. La lista ya está presente porque se renderiza en el servidor.
3. Explicar `useAsyncData`: Nuxt resuelve los datos durante SSR y los incluye en su payload;
   la hidratación puede reutilizarlos. La clave de la lista y la clave por ID identifican
   cada consulta. `SubjectService` usa `$fetch` sobre la API del mismo origen.
4. Explicar `server/`: Nitro ejecuta el servicio y los endpoints en el servidor. El navegador
   recibe el JSON solicitado, sin importar directamente el arreglo interno del servicio.
   Son datos públicos de demostración, sin sesión ni base de datos.
5. Abrir `/subjects/1` y luego un ID inexistente, como `/subjects/999`, para demostrar el
   detalle y el tratamiento de 404.
6. Abrir las herramientas: sus reglas desactivan SSR y sus interacciones se ejecutan en el
   navegador. En la calculadora, un promedio de 4,0 con 60 % evaluado aporta 2,4; para llegar
   a 3,0 se necesita 1,5 en el 40 % restante.

Referencias: [renderizado híbrido](https://nuxt.com/docs/4.x/guide/concepts/rendering),
[`useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data),
[directorio del servidor](https://nuxt.com/docs/4.x/directory-structure/server) y
[despliegue Node](https://nuxt.com/docs/4.x/getting-started/deployment).

## Despliegue en GCP Compute Engine

El destino previsto es una VM separada `notium-entregable2`, proyecto
`dw-mateo-lopera-2026`, zona `us-central1-c`. Los siguientes comandos preparan ese despliegue;
la presencia de esta guía no confirma que ya esté publicado. Usa siempre los parámetros de
proyecto y zona para no depender de la configuración activa del CLI.

**Es necesario ejecutar el servidor de Nitro. No uses `nuxt generate` ni publiques solamente
`.output/public` con nginx:** esas opciones no mantienen los endpoints y el renderizado SSR
que requiere esta aplicación híbrida.

Primero compila una imagen para la arquitectura de la VM. Hacer el build en el equipo local
evita compilar Nuxt en la memoria limitada de una `e2-micro`:

```bash
docker build --platform linux/amd64 -t notium-entregable2:latest .
docker save -o /tmp/notium-entregable2-image.tar notium-entregable2:latest
```

Prepara el script de instalación de Docker y crea la VM:

```bash
cat > /tmp/notium-entregable2-startup.sh <<'SH'
#!/bin/bash
set -eu
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y docker.io
systemctl enable --now docker
SH

gcloud compute instances create notium-entregable2 \
  --project=dw-mateo-lopera-2026 \
  --zone=us-central1-c \
  --machine-type=e2-micro \
  --image-family=debian-12 \
  --image-project=debian-cloud \
  --boot-disk-size=10GB \
  --boot-disk-type=pd-standard \
  --tags=http-server \
  --no-service-account \
  --metadata-from-file=startup-script=/tmp/notium-entregable2-startup.sh
```

Este proyecto ya tiene una regla HTTP para el tag `http-server` en la red `default`.
Comprueba esa regla y que Docker terminó de instalarse:

```bash
gcloud compute firewall-rules describe default-allow-http \
  --project=dw-mateo-lopera-2026
gcloud compute ssh notium-entregable2 \
  --project=dw-mateo-lopera-2026 --zone=us-central1-c \
  --command='sudo docker info'
```

Si Docker todavía se está instalando, espera y repite la última comprobación. Una vez listo,
transfiere y arranca la imagen:

```bash
gcloud compute scp /tmp/notium-entregable2-image.tar notium-entregable2:/tmp/ \
  --project=dw-mateo-lopera-2026 --zone=us-central1-c
gcloud compute ssh notium-entregable2 \
  --project=dw-mateo-lopera-2026 --zone=us-central1-c \
  --command='sudo docker load -i /tmp/notium-entregable2-image.tar && sudo docker run -d --name notium-entregable2 --restart unless-stopped -p 80:3000 notium-entregable2:latest'
gcloud compute instances describe notium-entregable2 \
  --project=dw-mateo-lopera-2026 --zone=us-central1-c \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

Abre `http://IP-DE-LA-VM` y revisa las rutas de la tabla, las herramientas, los enlaces
directos y los errores 404. Comprueba también que el HTML inicial de materias contiene
sus datos y que las herramientas se renderizan en el navegador. La política de reinicio
arranca el contenedor cuando vuelve a iniciar Docker.

Mantén la VM disponible durante la evaluación. Al apagarla, la IP temporal se libera y puede
cambiar en el siguiente arranque; consulta de nuevo su dirección antes de compartir el enlace.
La guía de [Compute Engine](https://docs.cloud.google.com/compute/docs/instances/create-start-instance)
describe la creación de VM. La fecha límite confirmada por el equipo es el **2 de noviembre
de 2026**; revisa la hora exacta del cierre en la plataforma del curso antes de entregar.
