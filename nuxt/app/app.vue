<script setup lang="ts">
// External imports
import { NuxtLink, NuxtPage } from '#components';
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Saltar al contenido</a>

    <header class="app-header">
      <div class="app-header__content">
        <NuxtLink class="brand" to="/" aria-label="Notium: ir al inicio">
          <span class="brand__mark" aria-hidden="true">N</span>
          <span class="brand__wordmark">Notium<span class="brand__dot">.</span></span>
        </NuxtLink>

        <nav class="main-navigation" aria-label="Navegación principal">
          <NuxtLink class="main-navigation__link" to="/" exact-active-class="is-active">
            Inicio
          </NuxtLink>
          <NuxtLink class="main-navigation__link" to="/blog" active-class="is-active">
            Blog
          </NuxtLink>
          <NuxtLink class="main-navigation__link" to="/subjects" active-class="is-active">
            Materias
          </NuxtLink>
          <NuxtLink class="main-navigation__link" to="/tools" active-class="is-active">
            Herramientas
          </NuxtLink>
        </nav>

        <span class="header-note">Tu semestre, con claridad.</span>
      </div>
    </header>

    <main id="main-content" class="app-main" tabindex="-1">
      <NuxtPage />
    </main>

    <footer class="app-footer">
      <div class="app-footer__content">
        <p><strong>Notium.</strong> Un espacio para avanzar.</p>
        <NuxtLink to="/tools/faq">Preguntas frecuentes <span aria-hidden="true">↗</span></NuxtLink>
      </div>
    </footer>
  </div>
</template>
