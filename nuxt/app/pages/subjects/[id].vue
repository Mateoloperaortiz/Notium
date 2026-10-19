<script setup lang="ts">
// Internal imports
import { SubjectService } from '~/services/SubjectService.js';

// State
const route = useRoute();

const request = useAsyncData(
  () => `subject-${String(route.params.id)}`,
  () => SubjectService.getSubjectById(String(route.params.id)),
);
const { data: subject, error, status } = request;

useSeoMeta({ title: () => subject.value?.name ?? 'Materia' });

// Functions
async function validateResponse(): Promise<void> {
  await request;

  if (error.value) {
    throw createError({
      statusCode: error.value.statusCode ?? 500,
      statusMessage:
        error.value.statusCode === 404 ? 'Materia no encontrada' : 'Error al cargar la materia',
    });
  }
}

// Watchers
watch(error, (value) => {
  if (value) {
    showError({
      statusCode: value.statusCode ?? 500,
      statusMessage:
        value.statusCode === 404 ? 'Materia no encontrada' : 'Error al cargar la materia',
    });
  }
});

// Lifecycle
onServerPrefetch(validateResponse);
</script>

<template>
  <section>
    <NuxtLink class="back-link" to="/subjects">← Todas las materias</NuxtLink>
    <p v-if="error" class="status-message status-message--error" role="alert">
      No fue posible cargar esta materia.
    </p>
    <p v-else-if="status === 'pending'" role="status">Cargando materia…</p>
    <article v-else-if="subject" class="prose">
      <header>
        <p class="eyebrow">{{ subject.code }}</p>
        <h1 class="page-heading">{{ subject.name }}</h1>
        <p class="lead">Información de la materia</p>
      </header>
      <dl class="subject-details">
        <div>
          <dt>Docente</dt>
          <dd>{{ subject.professor }}</dd>
        </div>
        <div>
          <dt>Créditos académicos</dt>
          <dd>{{ subject.credits }}</dd>
        </div>
        <div>
          <dt>Semestre</dt>
          <dd>{{ subject.semesterId }}</dd>
        </div>
        <div>
          <dt>Código</dt>
          <dd>{{ subject.code }}</dd>
        </div>
      </dl>
      <p>Este catálogo es una muestra de las materias que puedes organizar en Notium.</p>
      <NuxtLink class="button" to="/tools/calculator">Planear mi próxima nota</NuxtLink>
    </article>
  </section>
</template>

<style scoped>
.subject-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-block: 2rem;
}
dt {
  font-size: 0.9rem;
  color: var(--color-muted);
}
dd {
  margin: 0.4rem 0 0;
  font-weight: 600;
}
</style>
