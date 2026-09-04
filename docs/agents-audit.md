# Auditoría de cumplimiento de AGENTS.md

Fecha: 4 de septiembre de 2026.

Se revisó el código de `/Users/mateo/Documents/GitHub/Notium`, su configuración y el
`AGENTS.md` completo. La carpeta `/Users/mateo/Documents/ChatGPT/Notium` sólo contenía un
repositorio vacío. La revisión comenzó con el repositorio de GitHub sin cambios locales.

Tras las correcciones no se identifican incumplimientos pendientes de las obligaciones
aplicables al alcance actual: SPA Vue con datos mock y CRUD de semestres. Esto es una auditoría
del estado revisado; las decisiones de arquitectura también requieren revisión humana en
cambios futuros. El lint original pasaba, pero no comprobaba varias reglas del curso.

## Incumplimientos corregidos

| Regla       | Hallazgo                                                                                                 | Corrección                                                                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| §2.1 y §2.3 | Callbacks de `computed`, `watch`, router y Setup Store dependían de inferencia en parámetros o retornos. | Tipos explícitos; interfaces para el contrato del store y los módulos de vistas cargados por el router.                                                              |
| §2.5        | El orden de imports no era alfabético de forma consistente.                                              | Orden por ruta del módulo y miembros de cada import; ESLint verifica ambos.                                                                                          |
| §6.2 y §14  | `SemesterForm.vue` y `SemesterService.ts` repetían validaciones de nombre y fechas.                      | `SemesterService.validateFields` centraliza las reglas, compartidas con `create` y `update`. El formulario conserva la presentación de errores, el estado y el foco. |
| §7.2        | La vista enviaba una variable `CreateSemesterDTO` a una operación que espera `UpdateSemesterDTO`.        | La edición construye una variable explícita `UpdateSemesterDTO`. El servicio también tipa el DTO completo antes de validar actualizaciones parciales.                |

Se añadió `SemesterValidationErrorsDTO` para el resultado de validación entre servicio y
formulario. Los modelos siguen separados de los DTOs de entrada y no se agregaron contratos
de lectura que el proyecto no requiere.

## Checklist del alcance actual

| Reglas                           | Resultado y evidencia                                                                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| §1 y §12: consistencia y formato | Prettier pasa; imports, punto y coma, indentación y modificadores siguen una convención. Se conserva el patrón de exports por tipo de módulo.                                  |
| §2: TypeScript                   | Modelos, DTOs, servicios, helpers, métodos y callbacks tipados; sin `any`. Se permite inferencia en variables locales simples.                                                 |
| §3: responsabilidades y mocking  | UI, servicios, modelos y datos mock están separados. Los servicios permiten inyectar colecciones; `SemesterService` también permite sustituir el generador de identificadores. |
| §5: Vue/SPA                      | Composition API y SFC. Las rutas internas usan `RouterLink`; el router conserva carga diferida y navegación SPA.                                                               |
| §6: servicios                    | La UI accede a servicios, no importa datos mock ni accede directamente a almacenamiento o APIs. La validación de la operación queda en el servicio.                            |
| §7: DTOs                         | Creación, actualización y errores de validación usan contratos explícitos. Las lecturas conservan los modelos de acuerdo con los contratos actuales.                           |
| §8: estado                       | `userStore.ts` usa `defineStore('user', setup)`; el usuario compartido vive en el store. El estado propio de cada pantalla permanece local.                                    |
| §9: utilidades                   | `DateFormatUtil` agrupa funciones técnicas puras, reutilizables y sin dependencia de Vue.                                                                                      |
| §10: reactividad                 | Los `computed` derivan estado sin efectos secundarios; los `watch` sincronizan formularios y cargan datos ante cambios de ruta. Se usa `.value` en el script.                  |
| §11: componentes y vistas        | Pantallas en `views/`, componentes reutilizables en `components/`; comunicación mediante props y emits.                                                                        |
| §14 y §15: revisión final        | Se revisaron las obligaciones aplicables, las recomendaciones y los casos no aplicables; no se sustituyó la arquitectura actual.                                               |

## Reglas condicionales y recomendaciones

- §4: Express, MPA, SSR y EJS no aplican a esta etapa. Aunque no son obligatorios por esa
  sección para Vue, los modelos ya usan atributos privados y getters/setters y se conservan.
- §13: Tailwind no está instalado; el CSS actual no incumple una obligación de utilizarlo.
- §8.3: el alcance actual es memoria mock sin persistencia; no se agregó almacenamiento.
- §2.5: la exigencia de `.js` se formula para Node con ESM. Se adoptó consistentemente ese
  sufijo para módulos TypeScript locales, compatible con Vite, conservando `.vue` y `.css`.
  La ausencia anterior de `.js` en la SPA no se cuenta como infracción obligatoria de Vue.
- El enlace `href="#main-content"` es un salto accesible dentro de la página, no una ruta de
  Vue Router. Se conserva.
- Se siguen las recomendaciones aplicables: servicios sustituibles, utilidades agrupadas y
  organización por dominio. No se impusieron repositorios ni persistencia adicionales.

## Controles y verificación

El comando de entrega es:

```bash
npm run check
```

Ejecuta ESLint con cero advertencias, Prettier, `vue-tsc --build` y Vite. La configuración
incluye reglas de tipos explícitos, imports, `interface`, modificadores, Composition API,
Setup Stores, navegación interna estática y límites entre UI e infraestructura.

Resultados de esta revisión:

- `npm run check`: aprobado.
- 29 casos de ESLint en memoria: aprobado. Cubren errores y ejemplos válidos, incluidos
  parámetros con valores iniciales/rest, inferencia local permitida, imports, `any`, accesos
  `window.fetch`/`localStorage`, rutas relativas, anclas, descargas y Setup Stores con opciones.
- 28 aserciones funcionales de servicios: aprobado. Cubren CRUD, fechas reales y bisiestos,
  límites de nombre, normalización, actualizaciones parciales y ausencia de mutación tras errores.
- Comparación independiente con el servicio original: 405 combinaciones, 6 aceptadas y
  399 rechazadas; sin diferencias en aceptación ni datos normalizados. La validación del
  servicio utiliza ahora los mensajes por campo que ya mostraba el formulario.

Las comprobaciones de casos se ejecutaron durante la auditoría; no constituyen una suite de
regresión persistida. El comando `check` no ejecuta pruebas funcionales del CRUD ni pruebas
de navegador.

El workflow `.github/workflows/check.yml` ejecutará `npm ci` y `npm run check` en pushes y
pull requests al subir estos archivos. No se hizo commit, push ni ejecución remota de CI
durante esta revisión. No se configuró protección de ramas ni se afirma que GitHub bloquee
merges: eso depende de la configuración del repositorio.

Los controles automáticos cubren patrones estáticos, no demuestran por sí solos SRP,
ausencia de lógica duplicada, uso semántico de DTOs ni todas las formas posibles de acceder
a infraestructura. Esas reglas conservan la revisión obligatoria del checklist de `AGENTS.md`.
