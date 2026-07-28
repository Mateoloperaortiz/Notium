# Notium — Dashboard de seguimiento academico

Notium es un dashboard web para el seguimiento del proceso academico de un estudiante: semestres,
materias, calificaciones, porcentajes de cada evaluacion, notas acumuladas y promedios ponderados
por creditos.

Se construye con **Vue 3 + TypeScript** y, en esta primera version, la informacion vive en el
**LocalStorage** del navegador con datos ficticios generados en la primera carga.

## Estado del repositorio

Este es el commit inicial: todavia no hay codigo. La aplicacion se arma en tres entregas, una por
integrante, cada una en su rama y con su pull request hacia `main`.

| Integrante             | Usuario           | Entrega                                                    |
| ---------------------- | ----------------- | ---------------------------------------------------------- |
| Mateo Lopera Ortiz      | `Mateoloperaortiz` | Arquitectura: configuracion, capa de datos, sesion y layout |
| Samuel Martinez Arteaga | `SamuelMarti22`    | Nucleo academico: CRUD de semestres, materias y notas       |
| Samuel Llano Madrigal   | `Llano0`           | Analiticas, administracion de usuarios y pruebas            |

El reparto detallado, la guia de estilo y las reglas de programacion estan en el
[wiki del repositorio](https://github.com/Mateoloperaortiz/Notium/wiki), y las tareas en el
[tablero del proyecto](https://github.com/users/Mateoloperaortiz/projects/9).

## Como se ejecutara

Cuando la primera entrega este fusionada:

```bash
npm install
npm run dev
```

La ruta principal sera <http://localhost:5173/>.
