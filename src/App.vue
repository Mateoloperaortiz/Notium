<script setup lang="ts">
// Internal imports
import { Role, type UserInterface } from '@/interfaces/UserInterface.js';
import { AuthService } from '@/services/AuthService.js';

// External imports
import { computed } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';

// State
const router = useRouter();

// Computed
const loggedUser = computed<UserInterface | undefined>((): UserInterface | undefined =>
  AuthService.getLoggedUser(),
);

const isAdmin = computed<boolean>((): boolean => loggedUser.value?.role === Role.Admin);

const userInitials = computed<string>((): string => {
  const name = loggedUser.value?.name ?? 'Usuario';

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string): string => part.charAt(0).toUpperCase())
    .join('');
});

// Functions
function logout(): void {
  AuthService.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Saltar al contenido</a>

    <header class="app-header">
      <div class="app-header__content" :class="{ 'app-header__content--stacked': isAdmin }">
        <RouterLink class="brand" :to="{ name: 'home' }" aria-label="Ir al inicio de Notium">
          <span class="brand__mark" aria-hidden="true">N</span>
          <span class="brand__wordmark">Notium</span>
        </RouterLink>

        <nav class="main-navigation" aria-label="Navegación principal">
          <RouterLink class="main-navigation__link" :to="{ name: 'home' }"> Inicio </RouterLink>
          <RouterLink v-if="loggedUser" class="main-navigation__link" :to="{ name: 'dashboard' }">
            Mi dashboard
          </RouterLink>
          <RouterLink class="main-navigation__link" :to="{ name: 'semester-index' }">
            Semestres
          </RouterLink>
          <RouterLink
            v-if="loggedUser"
            class="main-navigation__link"
            :to="{ name: 'subject-index' }"
          >
            Materias
          </RouterLink>
          <RouterLink v-if="loggedUser" class="main-navigation__link" :to="{ name: 'grade-index' }">
            Notas
          </RouterLink>
          <RouterLink v-if="loggedUser" class="main-navigation__link" :to="{ name: 'analytics' }">
            Analíticas
          </RouterLink>
          <RouterLink v-if="isAdmin" class="main-navigation__link" :to="{ name: 'admin-users' }">
            Usuarios
          </RouterLink>
          <RouterLink v-if="isAdmin" class="main-navigation__link" :to="{ name: 'admin-reports' }">
            Reportes
          </RouterLink>
          <RouterLink v-if="!loggedUser" class="main-navigation__link" :to="{ name: 'login' }">
            Iniciar sesión
          </RouterLink>
        </nav>

        <div v-if="loggedUser" class="user-chip" :title="loggedUser.email">
          <span class="user-chip__avatar" aria-hidden="true">{{ userInitials }}</span>
          <span class="user-chip__content">
            <span class="user-chip__eyebrow">Sesión académica</span>
            <span class="user-chip__name">{{ loggedUser.name }}</span>
          </span>
          <button class="user-chip__logout" type="button" @click="logout">Cerrar sesión</button>
        </div>
      </div>
    </header>

    <main id="main-content" class="app-main">
      <RouterView />
    </main>
  </div>
</template>
