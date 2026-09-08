<script setup lang="ts">
// Internal imports
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import { SemesterService } from '@/services/SemesterService.js';
// External imports
import { computed, ref, shallowRef, watch } from 'vue';
import { RouterLink } from 'vue-router';

// Interfaces and types
interface Props {
  id: string;
}

// Props
const props = defineProps<Props>();

// View state
const semester = shallowRef<SemesterInterface>();
const errorMessage = ref<string>('');
const isLoading = ref<boolean>(true);

const subjectCount = computed<number>((): number => semester.value?.subjects.length ?? 0);

// Data loading
async function loadSemester(semesterId: string): Promise<void> {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    semester.value = await SemesterService.findById(semesterId);
  } catch (error: unknown) {
    errorMessage.value =
      error instanceof Error ? error.message : 'No fue posible cargar el semestre.';
    semester.value = undefined;
  } finally {
    isLoading.value = false;
  }
}

watch(
  (): string => props.id,
  (semesterId: string): void => {
    void loadSemester(semesterId);
  },
  { immediate: true },
);
</script>

<template>
  <section class="semester-detail" aria-labelledby="semester-detail-title">
    <RouterLink class="semester-detail__back" :to="{ name: 'semester-index' }">
      <span aria-hidden="true">←</span>
      Todos los semestres
    </RouterLink>

    <div v-if="isLoading" class="semester-detail__loading" aria-busy="true">Cargando semestre…</div>

    <p v-else-if="errorMessage" class="status-message status-message--error" role="alert">
      {{ errorMessage }}
    </p>

    <div v-else-if="semester">
      <header class="semester-detail__hero">
        <div>
          <p class="eyebrow">Detalle del semestre</p>
          <h1 id="semester-detail-title" class="page-title">{{ semester.name }}</h1>
          <p class="semester-detail__dates">
            Año {{ semester.year }} · Periodo {{ semester.period }}
          </p>
        </div>

        <div class="semester-detail__metric" aria-label="Cantidad de materias">
          <strong>{{ subjectCount }}</strong>
          <span>{{ subjectCount === 1 ? 'materia' : 'materias' }}</span>
        </div>
      </header>

      <section class="semester-detail__subjects" aria-labelledby="subjects-title">
        <div class="semester-detail__section-heading">
          <div>
            <p class="eyebrow">Siguiente módulo</p>
            <h2 id="subjects-title">Materias del semestre</h2>
          </div>
          <span>Próximamente</span>
        </div>

        <div class="semester-detail__placeholder">
          <span aria-hidden="true">＋</span>
          <div>
            <h3>El módulo Subject está preparado para crecer aquí</h3>
            <p>
              La relación ya existe en el dominio. La creación y gestión de materias se implementará
              en la siguiente etapa sin cambiar este módulo.
            </p>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="semester-detail__not-found">
      <span aria-hidden="true">404</span>
      <h1 id="semester-detail-title">No encontramos este semestre</h1>
      <p>Puede que haya sido eliminado o que el enlace no sea correcto.</p>
      <RouterLink class="button button--primary" :to="{ name: 'semester-index' }">
        Volver a semestres
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.semester-detail__back {
  display: inline-flex;
  align-items: center;
  margin-bottom: 2.5rem;
  gap: 0.55rem;
  color: var(--color-muted);
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
}

.semester-detail__back:hover {
  color: var(--color-accent);
}

.semester-detail__hero {
  display: flex;
  align-items: end;
  justify-content: space-between;
  padding: clamp(1.8rem, 5vw, 3.5rem);
  gap: 2rem;
  border-radius: 1.6rem;
  background: var(--color-ink);
  box-shadow: var(--shadow-card);
  color: #fffaf0;
}

.semester-detail__hero .eyebrow {
  color: #9ed2bd;
}

.semester-detail__dates {
  margin: 1.2rem 0 0;
  color: #c7d6cf;
}

.semester-detail__metric {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  min-width: 7rem;
  padding: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 1.1rem;
  background: rgba(255, 255, 255, 0.07);
}

.semester-detail__metric strong {
  font-family: var(--font-display);
  font-size: 2rem;
}

.semester-detail__metric span {
  color: #c7d6cf;
  font-size: 0.78rem;
}

.semester-detail__subjects {
  margin-top: 1.5rem;
  padding: clamp(1.4rem, 4vw, 2rem);
  border: 1px solid rgba(25, 51, 44, 0.09);
  border-radius: 1.3rem;
  background: rgba(255, 253, 248, 0.78);
}

.semester-detail__section-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
}

.semester-detail__section-heading .eyebrow {
  margin-bottom: 0.25rem;
}

.semester-detail__section-heading h2 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: -0.035em;
}

.semester-detail__section-heading > span {
  padding: 0.38rem 0.65rem;
  border-radius: 999px;
  background: var(--color-accent-light);
  color: var(--color-accent-dark);
  font-size: 0.7rem;
  font-weight: 750;
}

.semester-detail__placeholder {
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1.4rem;
  gap: 1rem;
  border: 1px dashed #bcc9c1;
  border-radius: 1rem;
}

.semester-detail__placeholder > span {
  display: grid;
  flex: 0 0 auto;
  width: 2.8rem;
  height: 2.8rem;
  place-items: center;
  border-radius: 0.8rem;
  background: #f0eee8;
  color: var(--color-muted);
  font-size: 1.25rem;
}

.semester-detail__placeholder h3,
.semester-detail__placeholder p {
  margin: 0;
}

.semester-detail__placeholder h3 {
  font-size: 0.96rem;
}

.semester-detail__placeholder p {
  margin-top: 0.35rem;
  color: var(--color-muted);
  font-size: 0.86rem;
  line-height: 1.6;
}

.semester-detail__loading,
.semester-detail__not-found {
  padding: 5rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 1.3rem;
  background: var(--color-surface);
  text-align: center;
}

.semester-detail__not-found > span {
  color: var(--color-highlight);
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 800;
}

.semester-detail__not-found h1 {
  margin: 0.5rem 0;
  font-family: var(--font-display);
}

.semester-detail__not-found p {
  margin: 0 0 1.5rem;
  color: var(--color-muted);
}

@media (max-width: 620px) {
  .semester-detail__hero {
    align-items: start;
    flex-direction: column;
  }

  .semester-detail__metric {
    align-items: start;
    min-width: 0;
  }

  .semester-detail__section-heading {
    flex-direction: column;
  }
}
</style>
