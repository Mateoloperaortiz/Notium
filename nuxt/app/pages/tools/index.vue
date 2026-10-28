<script setup lang="ts">
// Lifecycle
useSeoMeta({
  title: 'Herramientas',
  description:
    'Calcula la nota que necesitas y resuelve tus dudas sobre promedios, porcentajes y planeación académica.',
});
</script>

<template>
  <section aria-labelledby="tools-title">
    <p class="eyebrow">Un poco de claridad ayuda</p>
    <h1 id="tools-title" class="page-heading">Haz espacio para lo que sigue.</h1>
    <p class="lead">
      Herramientas sencillas para entender tus resultados y llegar a la próxima evaluación con una
      meta clara.
    </p>

    <div class="card-grid">
      <article class="card tool-card">
        <span class="tool-card__symbol" aria-hidden="true">↗</span>
        <h2>Calculadora de notas</h2>
        <p>
          ¿Qué promedio necesitas en las evaluaciones que faltan? Ingresa tus resultados actuales y
          encuentra una meta posible.
        </p>
        <NuxtLink class="button" to="/tools/calculator">Calcular mi nota</NuxtLink>
      </article>

      <article class="card tool-card">
        <span class="tool-card__symbol tool-card__symbol--warm" aria-hidden="true">?</span>
        <h2>Preguntas frecuentes</h2>
        <p>
          Diferencia promedio y aporte ponderado, entiende los porcentajes y conoce mejor tu espacio
          académico.
        </p>
        <NuxtLink class="button button--secondary" to="/tools/faq">Resolver mis dudas</NuxtLink>
      </article>
    </div>
  </section>
</template>

<style scoped>
.tool-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: clamp(1.5rem, 4vw, 2rem);
}

.tool-card__symbol {
  display: grid;
  width: 3rem;
  height: 3rem;
  margin-bottom: 1.7rem;
  place-items: center;
  border-radius: 0.75rem;
  background: var(--color-accent-light);
  color: var(--color-accent-dark);
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
}

.tool-card__symbol--warm {
  background: #f3e5c7;
  color: #775016;
}

.tool-card p {
  flex: 1;
  margin-bottom: 1.8rem;
}
</style>
