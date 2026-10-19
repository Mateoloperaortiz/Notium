<script setup lang="ts">
// Internal imports
import { PostService } from '~/services/PostService.js';

// State
const posts = PostService.getPosts();

useSeoMeta({ title: 'Blog académico' });
</script>

<template>
  <section>
    <header>
      <p class="eyebrow">Recursos para tu semestre</p>
      <h1 class="page-heading">Blog académico</h1>
      <p class="lead">
        Ideas prácticas para entender tus notas y organizar el trabajo de cada materia.
      </p>
    </header>
    <div class="card-grid">
      <article v-for="post in posts" :key="post.slug" class="card">
        <p class="eyebrow">{{ post.category }}</p>
        <h2>
          <NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink>
        </h2>
        <p>{{ post.summary }}</p>
        <NuxtLink :to="`/blog/${post.slug}`"
          >Leer artículo <span aria-hidden="true">→</span></NuxtLink
        >
      </article>
    </div>
  </section>
</template>
