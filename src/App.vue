<script setup lang="ts">
import { useUserStore } from '@/stores/userStore.js';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const userStore = useUserStore();
const { activeUser } = storeToRefs(userStore);

const userInitials = computed<string>((): string => {
  const name = activeUser.value?.getName() ?? 'Usuario';

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string): string => part.charAt(0).toUpperCase())
    .join('');
});

onMounted((): void => {
  void userStore.initialize();
});
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Saltar al contenido</a>

    <header class="app-header">
      <div class="app-header__content">
        <RouterLink class="brand" :to="{ name: 'dashboard' }" aria-label="Ir al inicio de Notium">
          <span class="brand__mark" aria-hidden="true">N</span>
          <span class="brand__wordmark">Notium</span>
        </RouterLink>

        <nav class="main-navigation" aria-label="Navegación principal">
          <RouterLink class="main-navigation__link" :to="{ name: 'dashboard' }">
            Inicio
          </RouterLink>
          <RouterLink class="main-navigation__link" :to="{ name: 'semester-index' }">
            Semestres
          </RouterLink>
        </nav>

        <div class="user-chip" :title="activeUser?.getEmail() ?? 'Usuario activo'">
          <span class="user-chip__avatar" aria-hidden="true">{{ userInitials }}</span>
          <span class="user-chip__content">
            <span class="user-chip__eyebrow">Sesión académica</span>
            <span class="user-chip__name">{{ activeUser?.getName() ?? 'Cargando…' }}</span>
          </span>
        </div>
      </div>
    </header>

    <main id="main-content" class="app-main">
      <RouterView />
    </main>
  </div>
</template>
