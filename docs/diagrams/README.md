# Arquitectura de Notium

Diagrama de la arquitectura actual, elaborado a partir del código de `main` el 15 de septiembre
de 2026. Conserva el estilo de la versión anterior: cliente, comunicación HTTP, área del frontend,
módulos, clases y archivos.

- [Archivo editable de draw.io](notium-arquitectura.drawio).
- [Vista vectorial SVG](notium-arquitectura.svg), con el modelo editable incorporado.
- [Vista previa PNG](notium-arquitectura.png).

Para editarlo, abre `notium-arquitectura.drawio` en draw.io / diagrams.net mediante **Archivo →
Abrir desde → Dispositivo**, o arrástralo al editor. Las cajas, los textos y los conectores son
elementos independientes; los archivos están agrupados por módulo.

## Qué representa

La aplicación es una SPA que se descarga del servidor y se ejecuta completa en el navegador: Vite
durante el desarrollo, GitHub Pages con nginx en producción. No hay backend ni base de datos.

El diagrama se organiza en una banda de arranque y tres columnas, de izquierda a derecha:

1. **Presentación.** `src/views/` resuelve las rutas y `src/components/` aporta las piezas
   reutilizables por dominio, incluidas las cinco gráficas de Chart.js.
2. **Negocio.** `src/services/` concentra la validación y las operaciones. `AnalyticsService` y
   `PlatformReportService` aparecen destacados porque son puros: reciben los datos y calculan, sin
   tocar los stores.
3. **Datos.** `src/stores/` son Setup Stores de Pinia y constituyen la única fuente de datos.
   `src/PiniaConfig.ts` los observa y los serializa en `localStorage` bajo la clave `piniaState`;
   los seeders solo aportan el estado inicial la primera vez.

El flujo de acceso a datos es `Vista o componente → Servicio → Store → localStorage`. Las flechas
continuas representan comunicación; las discontinuas, dependencias. Las relaciones se resumen por
módulo: no se enumeran todos los imports.

Las entidades del dominio son interfaces en `src/interfaces/`, con el enum `Role`, y los contratos
de entrada son los DTOs de `src/dtos/`. El proyecto no tiene clases de modelo.

## Cómo se regenera

Los tres archivos se generan desde un único modelo, de modo que la geometría del `.drawio`, la
del SVG y la del PNG no puedan divergir. Si la arquitectura cambia, conviene editar
`generador/model.py` y regenerar, en lugar de retocar los tres archivos a mano:

```bash
python3 docs/diagrams/generador/build.py
```

El script comprueba antes el layout y se detiene si encuentra aristas que atraviesan un módulo,
etiquetas encima de una caja o de otra etiqueta, o módulos solapados. El PNG se obtiene del SVG
con `rsvg-convert`, que se instala con `brew install librsvg`.
