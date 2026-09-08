<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore.js';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

const userInitials = computed<string>((): string => {
  const name = currentUser.value?.name ?? 'Usuario';

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string): string => part.charAt(0).toUpperCase())
    .join('');
});
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Saltar al contenido</a>

    <header class="app-header">
      <div class="app-header__content">
        <RouterLink class="brand" :to="{ name: 'home' }" aria-label="Ir al inicio de Notium">
          <span class="brand__mark" aria-hidden="true">N</span>
          <span class="brand__wordmark">Notium</span>
        </RouterLink>

        <nav class="main-navigation" aria-label="Navegación principal">
          <RouterLink class="main-navigation__link" :to="{ name: 'home' }"> Inicio </RouterLink>
          <RouterLink v-if="currentUser" class="main-navigation__link" :to="{ name: 'dashboard' }">
            Mi dashboard
          </RouterLink>
          <RouterLink class="main-navigation__link" :to="{ name: 'semester-index' }">
            Semestres
          </RouterLink>
          <RouterLink
            v-if="currentUser"
            class="main-navigation__link"
            :to="{ name: 'subject-index' }"
          >
            Materias
          </RouterLink>
          <RouterLink
            v-if="currentUser"
            class="main-navigation__link"
            :to="{ name: 'grade-index' }"
          >
            Notas
          </RouterLink>
          <RouterLink v-if="!currentUser" class="main-navigation__link" :to="{ name: 'login' }">
            Iniciar sesión
          </RouterLink>
        </nav>

        <div v-if="currentUser" class="user-chip" :title="currentUser.email">
          <span class="user-chip__avatar" aria-hidden="true">{{ userInitials }}</span>
          <span class="user-chip__content">
            <span class="user-chip__eyebrow">Sesión académica</span>
            <span class="user-chip__name">{{ currentUser?.name ?? 'Cargando…' }}</span>
          </span>
        </div>
      </div>
    </header>

    <main id="main-content" class="app-main">
      <RouterView />
    </main>
  </div>
</template>
