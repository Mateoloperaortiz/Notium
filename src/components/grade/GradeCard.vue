<script setup lang="ts">
// Internal imports
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
// External imports
import { RouterLink } from 'vue-router';

// Interfaces and types
interface Props {
  grade: GradeInterface;
  showActions?: boolean;
}

interface Emits {
  delete: [gradeId: string];
  edit: [grade: GradeInterface];
}

// Props and emits
const props = withDefaults(defineProps<Props>(), {
  showActions: true,
});
const emit = defineEmits<Emits>();

// Event handlers
const handleDelete = (): void => emit('delete', props.grade.id);
const handleEdit = (): void => emit('edit', props.grade);
</script>

<template>
  <article class="grade-card">
    <header class="grade-card__header">
      <div>
        <p class="grade-card__eyebrow">{{ grade.type }}</p>
        <h2 class="grade-card__title">{{ grade.title }}</h2>
      </div>
      <strong class="grade-card__value">{{ grade.value.toFixed(1) }}</strong>
    </header>

    <dl class="grade-card__details">
      <div>
        <dt>Materia</dt>
        <dd>{{ grade.subject.name }}</dd>
      </div>
      <div>
        <dt>Porcentaje</dt>
        <dd>{{ grade.percentage }}%</dd>
      </div>
      <div>
        <dt>Fecha</dt>
        <dd>{{ new Date(grade.date).toLocaleDateString('es-CO') }}</dd>
      </div>
    </dl>

    <footer class="grade-card__actions">
      <RouterLink
        class="grade-card__detail-link"
        :to="{ name: 'grade-show', params: { subjectId: grade.subject.id, gradeId: grade.id } }"
      >
        Ver detalle
      </RouterLink>
      <div v-if="showActions" class="grade-card__buttons">
        <button type="button" aria-label="Editar nota" @click="handleEdit">Editar</button>
        <button type="button" aria-label="Eliminar nota" @click="handleDelete">Eliminar</button>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.grade-card {
  display: grid;
  gap: 1.25rem;
  padding: 1.35rem;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}
.grade-card__header,
.grade-card__actions,
.grade-card__buttons {
  display: flex;
  align-items: center;
}
.grade-card__header,
.grade-card__actions {
  justify-content: space-between;
  gap: 1rem;
}
.grade-card__eyebrow {
  margin: 0 0 0.25rem;
  color: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}
.grade-card__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.1rem;
}
.grade-card__value {
  color: var(--color-accent-dark);
  font-family: var(--font-display);
  font-size: 2rem;
}
.grade-card__details {
  display: grid;
  gap: 0.7rem;
  margin: 0;
}
.grade-card__details div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.grade-card__details dt {
  color: var(--color-muted);
}
.grade-card__details dd {
  margin: 0;
  font-weight: 700;
  text-align: right;
}
.grade-card__detail-link {
  color: var(--color-accent-dark);
  font-weight: 700;
  text-decoration: none;
}
.grade-card__buttons {
  gap: 0.45rem;
}
.grade-card__buttons button {
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: 0.55rem;
  background: var(--color-surface);
  color: var(--color-ink);
  cursor: pointer;
}
@media (max-width: 34rem) {
  .grade-card__actions {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
