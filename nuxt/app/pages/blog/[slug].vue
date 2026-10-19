<script setup lang="ts">
// Internal imports
import { PostService } from '~/services/PostService.js';

// State
const route = useRoute();

definePageMeta({
  validate: (route) => Boolean(PostService.getPostBySlug(String(route.params.slug))),
});

// Computed
const post = computed(() => PostService.getPostBySlug(String(route.params.slug)));

useSeoMeta({
  title: () => post.value?.title ?? 'Artículo',
  description: () => post.value?.summary,
});
</script>

<template>
  <article v-if="post" class="prose">
    <NuxtLink class="back-link" to="/blog">← Todos los artículos</NuxtLink>
    <header>
      <p class="eyebrow">{{ post.category }}</p>
      <h1 class="page-heading">{{ post.title }}</h1>
      <p class="lead">{{ post.summary }}</p>
    </header>
    <section v-for="section in post.sections" :key="section.heading">
      <h2>{{ section.heading }}</h2>
      <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
    </section>
    <NuxtLink class="button button--secondary" to="/tools/calculator"
      >Calcular mi próxima nota</NuxtLink
    >
  </article>
</template>
