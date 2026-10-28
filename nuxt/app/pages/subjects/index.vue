<script setup lang="ts">
// Internal imports
import { SubjectService } from '~/services/SubjectService.js';

// State
const { data: subjects, error, status } = useAsyncData('subjects', SubjectService.getSubjects);

// Lifecycle
useSeoMeta({ title: 'Materias' });
</script>

<template>
  <section>
    <header>
      <p class="eyebrow">Tu espacio académico</p>
      <h1 class="page-heading">Materias</h1>
      <p class="lead">Explora las materias del catálogo de demostración de Notium.</p>
    </header>

    <p v-if="error" class="status-message status-message--error" role="alert">
      No fue posible cargar las materias. Intenta de nuevo recargando la página.
    </p>
    <p v-else-if="status === 'pending'" role="status">Cargando materias…</p>
    <ul v-else-if="subjects?.length" class="card-grid subject-list">
      <li v-for="subject in subjects" :key="subject.id" class="card">
        <p class="eyebrow">{{ subject.code }}</p>
        <h2>
          <NuxtLink :to="`/subjects/${subject.id}`">{{ subject.name }}</NuxtLink>
        </h2>
        <p>{{ subject.professor }}</p>
        <p class="metadata">{{ subject.credits }} créditos · Semestre {{ subject.semesterId }}</p>
      </li>
    </ul>
    <p v-else>No hay materias disponibles.</p>
  </section>
</template>

<style scoped>
.subject-list {
  padding: 0;
  list-style: none;
}
</style>
