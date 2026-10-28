<script setup lang="ts">
// External imports
import type { NuxtError } from '#app';

// Props
const props = defineProps<{ error: NuxtError }>();

// Functions
function returnHome(): void {
  void clearError({ redirect: '/' });
}
</script>

<template>
  <main class="error-page">
    <p class="eyebrow">Notium · {{ props.error.statusCode }}</p>
    <h1 class="page-heading">
      {{
        props.error.statusCode === 404
          ? 'Esta página no está en el plan.'
          : 'No pudimos abrir esta página.'
      }}
    </h1>
    <p class="lead">
      {{
        props.error.statusCode === 404
          ? 'Revisa la dirección o vuelve al inicio para seguir explorando.'
          : 'Intenta de nuevo desde el inicio. Si el problema continúa, vuelve más tarde.'
      }}
    </p>
    <button class="button" type="button" @click="returnHome">Volver al inicio</button>
  </main>
</template>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: min(100% - 3rem, 50rem);
  min-height: 100vh;
  margin: 0 auto;
  padding: 3rem 0;
}
</style>
