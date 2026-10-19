import type { PostInterface } from '../interfaces/PostInterface.js';

export const posts: PostInterface[] = [
  {
    slug: 'entender-promedio-ponderado',
    title: 'Cómo interpretar tu promedio ponderado',
    summary: 'Distingue el promedio de tus evaluaciones del aporte que ya llevas a la nota final.',
    category: 'Calificaciones',
    sections: [
      {
        heading: 'Cada evaluación tiene un peso',
        paragraphs: [
          'Sumar las notas y dividir por su cantidad solo funciona cuando todas las evaluaciones pesan lo mismo. Si un parcial vale el 30 % y un proyecto vale el 70 %, la nota del proyecto influye más en el resultado final.',
          'Para calcular la nota final, multiplica cada nota por su porcentaje dividido entre 100 y suma los aportes. Un parcial de 4,0 al 30 % aporta 1,2; un proyecto de 3,0 al 70 % aporta 2,1. La nota final es 3,3 sobre 5,0.',
        ],
      },
      {
        heading: 'Promedio evaluado y aporte acumulado',
        paragraphs: [
          'Cuando falta parte del curso, el aporte acumulado todavía no es el promedio de lo evaluado. Si has completado el 60 % con promedio 4,0, llevas un aporte de 2,4 a la nota final. Tu promedio evaluado sigue siendo 4,0.',
          'En Notium conviene registrar el peso real de cada evaluación y revisar cuánto porcentaje falta. No registres como cero una evaluación que todavía no has presentado: confundiría una nota obtenida con una nota pendiente.',
        ],
      },
      {
        heading: 'Comprueba los porcentajes',
        paragraphs: [
          'Los pesos de todas las evaluaciones de una materia deben sumar 100 %. Si todavía no tienes el plan completo, marca los datos como parciales y evita sacar conclusiones definitivas. Revisa además la política de redondeo del curso antes de comparar tu cálculo con la nota oficial.',
        ],
      },
    ],
  },
  {
    slug: 'planear-evaluaciones-semestre',
    title: 'Planea tus evaluaciones durante el semestre',
    summary: 'Convierte fechas y porcentajes en un plan de estudio que puedas revisar cada semana.',
    category: 'Organización',
    sections: [
      {
        heading: 'Empieza por el plan del curso',
        paragraphs: [
          'Antes de registrar notas, reúne las fechas, los porcentajes y los criterios de cada evaluación. Asocia cada evaluación con su materia y su semestre para evitar mezclar periodos o duplicar actividades.',
          'Una lista útil incluye el nombre de la actividad, su fecha, su tipo y su peso. Revisa el calendario completo para detectar semanas con varias entregas y reservar tiempo con anticipación.',
        ],
      },
      {
        heading: 'Prioriza según el trabajo pendiente',
        paragraphs: [
          'El peso de una evaluación ayuda a decidir dónde concentrar esfuerzo, pero también importan la dificultad y el tiempo de preparación. Divide un proyecto grande en pasos pequeños con fechas propias: entender el problema, preparar una primera versión, probarla y revisar la entrega.',
          'No dejes las verificaciones para el día del cierre. Comprueba archivos, enlaces y requisitos cuando todavía puedas corregir errores. Una entrega que abre y funciona es tan necesaria como el trabajo que contiene.',
        ],
      },
      {
        heading: 'Actualiza el plan con resultados reales',
        paragraphs: [
          'Después de cada evaluación, registra la nota obtenida y revisa tu avance. Si cambió una fecha o un porcentaje, corrige el registro con base en la información del docente. Usa la calculadora como apoyo de planificación y confirma siempre las reglas oficiales del curso.',
        ],
      },
    ],
  },
  {
    slug: 'leer-dashboard-academico',
    title: 'Lee tu dashboard académico con contexto',
    summary:
      'Usa las gráficas para formular preguntas y contrasta los resultados con las evaluaciones.',
    category: 'Seguimiento',
    sections: [
      {
        heading: 'Comprueba qué estás comparando',
        paragraphs: [
          'Un dashboard resume información, pero una cifra aislada no explica todo el semestre. Antes de comparar materias, revisa si sus notas usan la misma escala, si tienen porcentajes completos y si pertenecen al mismo periodo.',
          'Dos materias con promedio 4,0 pueden tener situaciones distintas: en una ya se evaluó el 90 % y en otra apenas el 20 %. El promedio y la cobertura evaluada responden preguntas diferentes y conviene leerlos juntos.',
        ],
      },
      {
        heading: 'Distingue los tipos de promedio',
        paragraphs: [
          'El promedio simple de varias materias les asigna la misma importancia. Un promedio ponderado por créditos considera la carga académica de cada una. No los confundas con la ponderación por porcentajes dentro de una sola materia.',
          'Por ejemplo, una materia de 3 créditos con nota 4,0 y una de 2 créditos con nota 3,0 dan un promedio por créditos de 3,6: (3 × 4,0 + 2 × 3,0) / 5. El promedio simple sería 3,5.',
        ],
      },
      {
        heading: 'Pasa de la gráfica a una acción',
        paragraphs: [
          'Si una gráfica muestra una caída, revisa las evaluaciones que la explican antes de atribuirle una causa. Puede faltar información o haber cambiado el tipo de actividad. Elige una acción concreta, como revisar un tema, pedir retroalimentación o anticipar una entrega, y vuelve a evaluar tu avance después.',
        ],
      },
    ],
  },
];
