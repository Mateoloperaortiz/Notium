<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <section class="not-found">
    <span aria-hidden="true">404</span>
    <p class="eyebrow">Página no encontrada</p>
    <h1 class="page-title">Parece que esta nota se perdió.</h1>
    <p class="page-description">La dirección no existe, pero puedes volver a un lugar conocido.</p>
    <RouterLink class="button button--primary" :to="{ name: 'dashboard' }">Ir al inicio</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  max-width: 44rem;
  padding: 3rem 0;
}

.not-found > span {
  display: block;
  margin-bottom: 1rem;
  color: var(--color-highlight);
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
}

.not-found .button {
  margin-top: 2rem;
}
</style>
