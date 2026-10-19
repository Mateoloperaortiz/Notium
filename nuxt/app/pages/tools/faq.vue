<script setup lang="ts">
// External imports
import { NuxtLink } from '#components';
import { useSeoMeta } from '#imports';

// Functions
useSeoMeta({
  title: 'Preguntas frecuentes',
  description:
    'Resuelve tus dudas sobre Notium, el promedio ponderado, los porcentajes de evaluación y la calculadora de notas.',
});
</script>

<template>
  <section class="faq" aria-labelledby="faq-title">
    <p class="eyebrow">Respuestas para avanzar</p>
    <h1 id="faq-title" class="page-heading">Las dudas también tienen su lugar.</h1>
    <p class="lead">
      Entiende tus notas y usa Notium con más confianza. Abre cada pregunta para ver la respuesta.
    </p>

    <div class="faq-list">
      <details open>
        <summary>¿Qué puedo hacer en Notium?</summary>
        <div>
          <p>
            Puedes explorar un catálogo de materias de ejemplo, leer ideas para organizar tu vida
            académica y calcular el promedio que necesitas en las evaluaciones pendientes. Es un
            espacio de apoyo para planear el semestre.
          </p>
        </div>
      </details>
      <details>
        <summary>¿Las materias que aparecen son mi historial académico?</summary>
        <div>
          <p>
            El catálogo presenta datos de ejemplo para conocer las materias, sus créditos y sus
            docentes. No corresponde a tu matrícula ni al registro oficial de tu universidad.
            Consulta tu sistema académico para verificar tus resultados personales.
          </p>
        </div>
      </details>
      <details>
        <summary>¿Qué diferencia hay entre promedio y aporte a la nota final?</summary>
        <div>
          <p>
            El promedio expresa cómo te ha ido en lo que ya se calificó. El aporte indica cuántos
            puntos de la nota final ya ganaste. Si tu promedio es 4,0 y has completado el 60 %, tu
            aporte es 4,0 × 0,60 = 2,4 puntos.
          </p>
          <p>
            En la calculadora escribe <strong>4,0 como promedio actual</strong> y
            <strong>60 como porcentaje evaluado</strong>. El aporte se calcula automáticamente.
          </p>
        </div>
      </details>
      <details>
        <summary>¿Cómo encuentro mi promedio si cada evaluación tiene un peso distinto?</summary>
        <div>
          <p>
            Multiplica cada nota por su porcentaje, suma esos productos y divide entre la suma de
            los porcentajes ya evaluados. Por ejemplo, 4,0 en un examen del 20 % y 3,0 en un trabajo
            del 30 % dan un promedio de (4,0 × 20 + 3,0 × 30) ÷ 50 = 3,4 en el 50 % del curso.
          </p>
        </div>
      </details>
      <details>
        <summary>¿La nota necesaria corresponde a una sola evaluación?</summary>
        <div>
          <p>
            Es el promedio ponderado de todo lo que falta. Si solo queda una evaluación, corresponde
            a esa nota. Si quedan varias con pesos distintos, puedes combinar sus resultados de
            diferentes maneras para alcanzar el promedio indicado.
          </p>
        </div>
      </details>
      <details>
        <summary>¿Qué significa que la meta sea inalcanzable o que necesite 0?</summary>
        <div>
          <p>
            Si el resultado supera 5, la meta no se alcanza dentro de la escala de 0 a 5 con las
            notas ingresadas. Si el resultado es 0, el aporte ya ganado alcanza tu meta aun con cero
            en lo pendiente. Revisa siempre si el curso exige asistencia, entregas o notas mínimas
            por evaluación.
          </p>
        </div>
      </details>
      <details>
        <summary>¿Puedo calcular si todavía no tengo notas o ya se evaluó todo?</summary>
        <div>
          <p>
            La calculadora necesita que haya un porcentaje evaluado y otro pendiente. Si aún no
            tienes notas, tu promedio necesario en el curso completo coincide con tu meta. Si ya se
            evaluó el 100 %, tu resultado final se obtiene sumando el aporte de todas las notas.
          </p>
        </div>
      </details>
      <details>
        <summary>¿La calculadora reemplaza la calificación oficial?</summary>
        <div>
          <p>
            La calculadora sirve para hacer una proyección. Utiliza una escala de 0 a 5 y supone que
            los pesos suman 100 %. La nota de aprobación, las aproximaciones y las condiciones
            adicionales dependen de las reglas de tu curso.
          </p>
        </div>
      </details>
    </div>

    <aside class="faq-next">
      <div>
        <h2>Ahora ponle números a tu meta.</h2>
        <p>Con tu promedio y el porcentaje evaluado es suficiente para empezar.</p>
      </div>
      <NuxtLink class="button" to="/tools/calculator"
        >Abrir calculadora <span aria-hidden="true">→</span></NuxtLink
      >
    </aside>
  </section>
</template>

<style scoped>
.faq-list {
  max-width: 52rem;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: var(--color-surface);
}

.faq-list details + details {
  border-top: 1px solid var(--color-border);
}

.faq-list summary {
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
}

.faq-list summary::marker {
  color: var(--color-accent);
}

.faq-list details[open] summary {
  color: var(--color-accent-dark);
}

.faq-list details > div {
  padding: 0 1.5rem 0.5rem;
  color: var(--color-muted);
  font-size: 0.9rem;
  line-height: 1.85;
}

.faq-list strong {
  color: var(--color-ink);
}

.faq-next {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  max-width: 52rem;
  margin-top: 2rem;
  padding: 1.6rem;
  border-radius: 1rem;
  background: var(--color-accent-light);
}

.faq-next h2 {
  margin-bottom: 0.5rem;
  font-size: 1.15rem;
}

.faq-next p {
  margin: 0;
  color: #4c6255;
  font-size: 0.85rem;
}

@media (max-width: 600px) {
  .faq-list summary {
    padding: 1rem;
  }

  .faq-list details > div {
    padding-right: 1rem;
    padding-left: 1rem;
  }
}
</style>
