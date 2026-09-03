# AGENTS.md

## Propósito

Este archivo define las reglas de desarrollo que deben seguir los agentes de IA al modificar o generar código para este proyecto.

Estas reglas se derivan de las presentaciones del curso **Ingeniería de Software para Aplicaciones Web (2026)** del profesor Daniel Correa. En este curso no basta con que el código funcione: el código autogenerado debe adaptarse a los patrones, estándares y buenas prácticas definidos en clase.

### Lenguaje normativo

- **MUST / DEBE**: regla explícita del curso o consecuencia directa de una instrucción presentada como obligatoria.
- **SHOULD / DEBERÍA**: recomendación explícita del profesor, normalmente presentada como mejora, recomendación o criterio de diseño.
- **MAY / PUEDE**: alternativa permitida por el material.

Cuando una regla específica de una tecnología contradiga una regla general, se debe aplicar la regla más específica.

---

# 1. Reglas generales del curso

## 1.1. El código debe ajustarse a los estándares del curso

- El agente **DEBE** priorizar los patrones y convenciones definidos en estas reglas por encima de preferencias personales o estilos alternativos.
- El agente **DEBE** producir código mantenible, escalable y fácil de leer.
- El agente **DEBE** buscar consistencia en todo el proyecto: nombres, formato, estructura, responsabilidades y estilo.
- El agente **NO DEBE** considerar que una solución es correcta únicamente porque funciona.
- El código generado con IA **DEBE** quedar comprensible para los integrantes del proyecto y adaptado a las convenciones del curso.

## 1.2. Consistencia

El profesor enfatiza que el proyecto debe permitir que todos “hablemos un mismo idioma”. Por tanto:

- El agente **DEBE** mantener consistencia en nombres de clases, métodos, funciones, variables y archivos.
- El agente **DEBE** mantener consistencia en la ubicación de llaves.
- El agente **DEBE** mantener consistencia en indentación y espaciado.
- El agente **DEBE** mantener consistencia en el uso de punto y coma.
- El agente **DEBE** mantener consistencia en la forma de exportar/importar módulos.
- El agente **DEBE** mantener consistencia en el uso de `default export`; no mezclar exports por defecto y nombrados de forma arbitraria.
- El agente **DEBE** mantener consistencia en el uso explícito de modificadores como `public`; no declararlo en unas clases/métodos y omitirlo en otros sin una convención clara.
- El agente **DEBE** mantener consistencia en la forma en que se pasan datos entre capas y hacia las vistas.
- El agente **DEBE** evitar que una misma responsabilidad se resuelva con múltiples estrategias diferentes sin una razón clara.

## 1.3. Código limpio y legibilidad

- El código **DEBE** tener suficiente espacio visual para “respirar”.
- El agente **DEBE** corregir indentación inconsistente.
- Los nombres **DEBEN** expresar claramente la responsabilidad del elemento.
- El agente **DEBE** evitar nombres ambiguos o inconsistentes.
- Cuando una clase o archivo acumule responsabilidades distintas, el agente **DEBERÍA** separar esas responsabilidades.

---

# 2. TypeScript

## 2.1. Tipado obligatorio

El tipado es especialmente importante en código que define contratos o comportamiento reutilizable.

El agente **DEBE** tipar explícitamente:

- modelos;
- entidades;
- DTOs;
- contratos de API;
- parámetros de funciones y métodos;
- retornos de funciones y métodos;
- servicios;
- helpers;
- librerías internas.

## 2.2. Evitar `any`

- El agente **DEBE** evitar `any`.
- Si existe información suficiente para representar un dato mediante un tipo concreto, interface, type, DTO u otro tipo de TypeScript, se **DEBE** utilizar ese tipo.

## 2.3. Inferencia de tipos

No todo requiere anotaciones explícitas.

El agente **PUEDE** dejar que TypeScript infiera el tipo cuando:

- se trata de una variable local;
- el tipo es obvio por el valor asignado;
- agregar el tipo no aporta claridad adicional.

El agente **NO DEBE** eliminar tipado explícito de contratos, dominio, funciones, métodos o APIs únicamente porque TypeScript pueda inferirlo internamente.

## 2.4. `interface` vs `type`

- Usar **`interface`** para describir objetos y contratos.
- Usar **`type`** cuando se necesiten tipos más flexibles o compuestos, por ejemplo uniones, literales u otras composiciones de tipos.

## 2.5. Importaciones

- Las importaciones **DEBEN** mantenerse en orden alfabético.
- El agente **DEBE** respetar el sistema de módulos configurado en el proyecto.

### Proyectos Node con ESM

Cuando `package.json` utilice:

```json
{
  "type": "module"
}
```

entonces:

- las importaciones **DEBEN** usar sintaxis ESM (`import` / `export`);
- las rutas de archivos locales en imports **DEBEN** incluir la extensión `.js`, incluso cuando el archivo fuente sea TypeScript.

---

# 3. Arquitectura y responsabilidades

## 3.1. SRP — Single Responsibility Principle

- Cada módulo, clase, componente, controlador, servicio o utilidad **DEBE** tener una responsabilidad clara.
- El agente **DEBE** evitar mezclar responsabilidades de diferentes capas.
- Si una pieza de código empieza a encargarse de tareas no relacionadas con su responsabilidad principal, el agente **DEBERÍA** moverlas a la capa o clase correspondiente.

## 3.2. Evitar acoplamiento con infraestructura

- La UI **NO DEBE** depender directamente de la fuente de datos.
- Los componentes **NO DEBEN** importar directamente una base de datos, almacenamiento o infraestructura cuando esa responsabilidad corresponda a un servicio.
- El agente **DEBE** favorecer diseños donde la fuente de datos pueda cambiar sin modificar múltiples componentes.

## 3.3. Testing y mocking

- El diseño **DEBERÍA** permitir reemplazar dependencias por mocks durante testing.
- El agente **DEBERÍA** evitar dependencias rígidas que hagan difícil mockear servicios o infraestructura.
- Cuando el proyecto utilice instancias para facilitar testing, el agente **DEBE** preservar ese patrón.

---

# 4. Express / MPA / SSR

Estas reglas aplican cuando se trabaje en la parte Express/MPA/SSR del proyecto.

## 4.1. Rutas

Los archivos de rutas **DEBEN** concentrarse en routing y delegación.

- Una ruta **DEBE** delegar el trabajo a métodos de controladores.
- Los archivos de rutas **NO DEBEN** acumular lógica de negocio.
- Las rutas y métodos **DEBEN** tener nombres claros y consistentes.
- Si un conjunto de rutas pertenece a otra responsabilidad, **DEBERÍA** moverse a otro controlador.
- Si el número de rutas crece demasiado, **DEBERÍAN** separarse en múltiples archivos de rutas.
- Las funciones relacionadas con rutas **DEBEN** tener sus tipos de retorno correctamente definidos.

## 4.2. Controladores

- Los parámetros y retornos de los métodos del controlador **DEBEN** estar tipados.
- El agente **DEBE** evitar `any`.
- Los métodos **DEBEN** seguir una convención de nombres consistente.
- La forma de enviar datos hacia las vistas **DEBE** ser consistente.
- Un controlador **NO DEBE** acumular acciones que correspondan claramente a otra responsabilidad.

## 4.3. Modelos

- Los atributos de los modelos **DEBEN** ser privados.
- El acceso a atributos privados **DEBE** realizarse mediante getters y setters cuando corresponda.
- Las propiedades **DEBEN** utilizar nombres consistentes con las convenciones del proyecto.
- Los atributos/propiedades de instancia **NO DEBEN** comenzar en mayúscula; por ejemplo, preferir `category` sobre `Category`.
- Si un modelo crece demasiado o empieza a contener lógica de acceso a datos que excede su responsabilidad, esa lógica **DEBERÍA** moverse a otra clase, por ejemplo un repositorio.

## 4.4. Vistas EJS

- Las vistas **DEBEN** acceder a los datos del modelo mediante sus getters cuando el modelo exponga ese mecanismo.
- Las vistas **DEBEN** mantener indentación y espaciado consistentes.
- Cuando existan múltiples vistas de un mismo dominio, **DEBERÍAN** agruparse en un subdirectorio correspondiente al dominio.
- Si la aplicación evoluciona a múltiples idiomas, **DEBERÍA** configurarse correctamente el atributo `lang`.
- EJS **PUEDE** utilizarse para reutilizar vistas parciales como headers y footers.

## 4.5. MPA/SSR

- En una MPA, la navegación normal implica una nueva petición y una recarga completa de la página.
- En SSR, el servidor genera el HTML completo utilizando lógica, datos y plantillas.
- El agente **NO DEBE** convertir accidentalmente una solución MPA/SSR en una SPA si el ejercicio exige MPA/SSR.

---

# 5. Vue / SPA / CSR

Estas reglas aplican cuando se trabaje en la parte Vue/SPA/CSR del proyecto.

## 5.1. Arquitectura del frontend

El frontend del curso utiliza una arquitectura modular por capas/módulos.

El agente **DEBE** respetar la separación entre carpetas/responsabilidades como:

- `views/`;
- `components/`;
- `services/`;
- `dtos/`;
- `stores/`;
- utilidades.

El agente **NO DEBE** colocar lógica arbitrariamente en componentes si existe una capa específica para esa responsabilidad.

## 5.2. Single File Components

Los componentes Vue se organizan como SFC (`.vue`) con:

- `<script>` para lógica;
- `<template>` para la vista;
- `<style>` para estilos cuando sean necesarios.

Para los ejercicios del curso, el agente **DEBE** seguir el enfoque de **Composition API** utilizado en las presentaciones.

## 5.3. Vue Router

Para navegación interna de una SPA que utiliza Vue Router:

- El agente **DEBE** usar `RouterLink` para enlaces internos.
- El agente **NO DEBE** usar `<a href="...">` para navegación interna controlada por Vue Router, ya que provocaría una recarga completa de la página.
- Las rutas **DEBEN** mantener claramente diferenciados `path`, `name`, `component` y, cuando se utilice, `meta`.

## 5.4. SPA/CSR

- En una SPA, la navegación interna **NO DEBE** provocar recargas completas de la página.
- El servidor normalmente entrega datos a la SPA y el navegador actualiza dinámicamente el DOM.
- El agente **NO DEBE** introducir comportamientos que rompan accidentalmente el enfoque SPA/CSR exigido por el ejercicio.

---

# 6. Capa de servicios

La capa de servicios es una regla arquitectónica central del curso.

## 6.1. Responsabilidad

Los servicios **DEBEN** separar la lógica de negocio y acceso a datos de la UI.

Los componentes/vistas **NO DEBEN** conocer directamente:

- la base de datos;
- `localStorage` como fuente de dominio;
- mocks de infraestructura;
- detalles concretos de APIs;
- otra fuente de datos que pueda ser encapsulada por un servicio.

## 6.2. Qué debe ir en servicios

Cuando corresponda, los servicios **DEBEN** centralizar:

- acceso a datos;
- reglas de negocio relacionadas con la operación;
- validaciones relacionadas con la operación;
- transformaciones;
- logging relacionado con la operación;
- integración con infraestructura.

Esto debe permitir:

- reducir acoplamiento;
- reutilizar lógica;
- facilitar testing y mocking;
- cambiar la fuente de datos sin modificar componentes;
- escalar la aplicación de manera ordenada.

---

# 7. DTOs

## 7.1. Uso de DTOs

Un DTO tiene como única responsabilidad transportar datos entre capas o sistemas.

El agente **DEBE** utilizar DTOs cuando los datos crucen límites entre capas y el curso/proyecto haya definido ese contrato mediante DTOs.

Los DTOs **DEBEN** ayudar a:

- separar el modelo interno del modelo expuesto;
- controlar qué campos se envían;
- evitar exponer datos sensibles;
- validar la estructura de entrada;
- estandarizar respuestas;
- realizar mapping o transformaciones entre representaciones.

## 7.2. No sustituir DTOs por modelos arbitrariamente

- El agente **NO DEBE** reutilizar automáticamente una interface de modelo como DTO solo porque tenga campos parecidos.
- Cuando el flujo espere un DTO, el agente **DEBE** enviar una variable tipada con el DTO correspondiente.

---

# 8. Pinia y estado compartido

## 8.1. Store

- El estado verdaderamente global o compartido **DEBE** centralizarse en un store cuando corresponda.
- La lógica relacionada con ese estado global **DEBE** mantenerse organizada dentro del store o las capas correspondientes.

## 8.2. Estilo de store

En este curso:

- Los stores de Pinia **DEBEN** definirse con `defineStore`.
- El store **DEBE** tener un `id` identificador.
- Se **DEBE** utilizar el estilo **Setup Store** en lugar de Option Store.
- Las variables declaradas con `ref` dentro del store representan el `state`.

## 8.3. Persistencia del store

Cuando el ejercicio requiera persistencia en el navegador:

1. crear la instancia global del store;
2. buscar estado previamente guardado;
3. hidratar el store si existe información persistida;
4. usar una estructura inicial si no existe;
5. observar cambios del store;
6. persistir los cambios en el navegador.

El agente **NO DEBE** asumir persistencia si el ejercicio no la requiere.

---

# 9. Capa Util

## 9.1. Qué es una utilidad

Una utilidad **DEBE** encapsular lógica técnica o repetitiva que no pertenece directamente a:

- una vista;
- un componente;
- un store;
- un servicio de dominio.

Las funciones utilitarias **DEBEN** ser:

- independientes;
- reutilizables;
- sin estado propio;
- sin dependencia directa de Vue.

## 9.2. Organización

- Aunque una utilidad podría implementarse como función suelta, el curso **RECOMIENDA** agrupar funciones relacionadas en clases para hacer explícito qué utilidades pertenecen juntas.
- Si una transformación o formateo se repite o ensucia un componente, **DEBERÍA** moverse a una utilidad cuando esa responsabilidad no pertenezca a un servicio.

---

# 10. Reactividad en Vue

## 10.1. Variables no reactivas

Usar una variable normal de JavaScript cuando:

- Vue no necesita observarla;
- sus cambios no deben actualizar la UI;
- se utiliza para lógica interna que no afecta la vista.

Una variable que no cambia **NO NECESITA** convertirse en `ref`.

## 10.2. Variables reactivas

Usar `ref` cuando:

- el valor cambia;
- el cambio afecta la interfaz;
- Vue debe observar el valor y actualizar el DOM.

En código JavaScript/TypeScript del `<script>`, los valores creados con `ref` **DEBEN** manipularse mediante `.value`.

## 10.3. `computed`

Usar `computed` únicamente para valores derivados de estado reactivo.

Un `computed`:

- **DEBE** calcular y retornar un valor;
- **DEBE** depender de variables reactivas;
- **NO DEBE** utilizarse para efectos secundarios.

Un `computed` **NO DEBE**:

- llamar una API;
- guardar datos en `localStorage`;
- modificar otra variable como efecto secundario;
- utilizarse cuando el valor ni siquiera depende de estado reactivo.

## 10.4. `watch`

Usar `watch` cuando se necesite ejecutar una acción como consecuencia de un cambio.

Los watchers son apropiados para:

- llamadas a API;
- persistencia en `localStorage`;
- validaciones;
- redirecciones;
- otros efectos secundarios disparados por cambios reactivos.

Regla práctica del curso:

> Si necesitamos **hacer algo** cuando algo cambie, probablemente corresponde usar `watch`.

---

# 11. Componentes y vistas en Vue

## 11.1. Componentes

Un componente **DEBE** tener una responsabilidad específica.

Un componente puede:

- ser reutilizable;
- recibir propiedades;
- emitir eventos;
- contener componentes hijos.

## 11.2. Views

Una View representa normalmente:

- una pantalla completa;
- una ruta del sistema de navegación.

Por tanto:

- las Views **DEBEN** vivir en `views/`;
- normalmente **NO SON** componentes reutilizables;
- normalmente son cargadas desde el router.

## 11.3. Componentes hijos

Los componentes hijos reutilizables **DEBEN** vivir en `components/`.

La comunicación típica **DEBE** seguir:

- **Parent → Child:** `props`;
- **Child → Parent:** `emit`.

El padre pasa datos al hijo mediante props y el hijo comunica eventos al padre mediante emits.

---

# 12. Prettier y ESLint

## 12.1. Prettier

- El proyecto **DEBE** mantener formato consistente.
- Cuando Prettier esté configurado, el agente **DEBE** respetar su resultado en lugar de imponer formato manual incompatible.
- Prettier se utiliza para formato; el agente **NO DEBE** tratarlo como una herramienta que corrige errores lógicos.

## 12.2. ESLint

- Cuando ESLint esté configurado, el agente **DEBE** respetar sus reglas.
- El agente **DEBE** corregir errores y malas prácticas detectadas por ESLint que sean consecuencia de sus cambios.
- La configuración de reglas del proyecto se encuentra en `eslint.config.ts` cuando esa estructura sea la utilizada.

---

# 13. Tailwind CSS

Cuando el proyecto utilice Tailwind:

- El agente **DEBERÍA** preferir utilidades de Tailwind para estilos que pueden expresarse directamente mediante sus clases.
- El agente **DEBERÍA** evitar crear CSS personalizado innecesario si la combinación de utilidades de Tailwind resuelve el caso de forma clara.
- Las clases deben combinarse para construir el diseño, manteniendo el enfoque `utility-first`.

---

# 14. Checklist obligatorio antes de terminar una tarea

Antes de dar una tarea por terminada, el agente debe verificar:

- [ ] ¿El código sigue las convenciones ya presentes en el proyecto?
- [ ] ¿Los imports están ordenados alfabéticamente?
- [ ] ¿Los parámetros y retornos importantes están tipados?
- [ ] ¿Se evitó `any`?
- [ ] ¿Los modelos, entidades, DTOs y contratos están tipados?
- [ ] ¿Cada archivo/clase/componente mantiene una responsabilidad clara?
- [ ] ¿La UI está desacoplada de la fuente concreta de datos?
- [ ] ¿La lógica reutilizable está en servicios o utilidades según corresponda?
- [ ] ¿Los datos entre capas utilizan los DTOs definidos cuando corresponde?
- [ ] ¿Se evitó duplicar lógica?
- [ ] ¿La solución es fácil de mockear y testear?
- [ ] ¿Los componentes Vue usan correctamente `ref`, `computed` y `watch`?
- [ ] ¿Los componentes hijos reciben datos por `props` y notifican por `emit`?
- [ ] ¿Las Views están en `views/` y los componentes reutilizables en `components/`?
- [ ] ¿La navegación interna Vue usa `RouterLink`?
- [ ] ¿Los stores Pinia siguen Setup Store?
- [ ] ¿El formato, llaves, indentación, espaciado y punto y coma son consistentes?
- [ ] ¿El código respeta Prettier y ESLint si están configurados?
- [ ] ¿El agente entiende y puede explicar el código que generó?
- [ ] ¿La solución respeta el enfoque solicitado (MPA/SSR o SPA/CSR) sin mezclar arquitecturas accidentalmente?

---

# 15. Criterio de decisión ante dudas

Si una regla no está completamente especificada:

1. preservar la consistencia con el código cercano que ya siga las convenciones del curso;
2. preferir SRP y bajo acoplamiento;
3. mantener tipado explícito en contratos y límites entre capas;
4. ubicar la lógica en la capa que tenga esa responsabilidad;
5. evitar introducir una estrategia diferente para resolver un problema que el proyecto ya resuelve de manera consistente.

No utilizar una preferencia personal del agente para reemplazar una convención establecida por el curso o por el proyecto.


---

# 16. Trazabilidad con las presentaciones del curso

Estas reglas fueron consolidadas únicamente a partir de las presentaciones disponibles en el material fuente:

- **Presentación 01 — Presentación del Curso**: objetivos de mantenibilidad/usabilidad/portabilidad; metodología de la “dictadura”; consistencia de patrones; uso responsable de IA y obligación de adaptar código autogenerado a los estándares de clase (diapositivas 5, 6, 14 y 15).
- **Presentación 03 — Introducción a Aplicaciones MPA/SSR**: MPA/SSR, ESM mediante `type: module`, uso de `import`, Express/EJS y enfoque utility-first de Tailwind (diapositivas 8-10, 19, 24, 28 y 37-38).
- **Presentación 04 — Fundamentos de Aplicaciones MPA/SSR**: TypeScript; SRP en rutas; imports alfabéticos; tipado de parámetros/retornos; evitar `any`; consistencia de nombres/formato; atributos privados; getters/setters; posible repositorio; organización y limpieza de vistas (diapositivas 3, 6-7, 11, 13, 17 y 19-20).
- **Presentación 05 — Introducción a Aplicaciones SPA/CSR**: SPA/CSR, Vue, Composition API, Vue Router, `RouterLink`, SFC y uso de valores reactivos mediante `ref` (diapositivas 8-10, 15-17, 21, 23-30).
- **Presentación 06 — Fundamentos de Aplicaciones SPA/CSR**: Prettier, ESLint, recomendaciones de tipado, `interface` vs `type`, capa de servicios, SRP, desacoplamiento, testing/mocking, DTOs, Pinia y Setup Stores (diapositivas 4-9, 11-18, 20-25 y 27-31).
- **Presentación 07 — Elementos Avanzados de Aplicaciones SPA/CSR**: arquitectura modular por capas, capa Util, variables no reactivas/reactivas/computadas, watchers, componentes, views, props/emits y observaciones de consistencia en servicios/DTOs (diapositivas 6-12, 14-18 y 20-32).

No se añadieron como obligaciones aquellas ideas que en las diapositivas aparecen únicamente como descripción conceptual de una tecnología. Cuando el profesor presentó algo como “quizás”, “recomendamos” o posible mejora, este archivo lo conserva como **DEBERÍA** en vez de convertirlo arbitrariamente en **DEBE**.
