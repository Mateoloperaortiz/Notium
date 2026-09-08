<script setup lang="ts">
// External imports
import { RouterLink } from 'vue-router';

// Interfaces and types
interface Props {
  semesterId: string;
  subjectId: string;
}

// Props
defineProps<Props>();
</script>

<template>
  <section class="placeholder-view">
    <p class="eyebrow">Módulo futuro</p>
    <h1 class="page-title">Detalle de materia</h1>
    <p class="page-description">
      Esta ruta ya respeta la jerarquía Semester → Subject. La funcionalidad será implementada por
      el equipo responsable del módulo.
    </p>
    <RouterLink
      class="button button--secondary"
      :to="{ name: 'semester-show', params: { id: semesterId } }"
    >
      Volver al semestre
    </RouterLink>
  </section>
</template>

<style scoped>
.placeholder-view {
  max-width: 44rem;
  padding: clamp(2rem, 6vw, 4rem);
  border-radius: 1.5rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.placeholder-view .button {
  margin-top: 2rem;
}
</style>
