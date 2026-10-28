<template>
  <div>
    <nav class="tools-navigation" aria-label="Herramientas académicas">
      <NuxtLink to="/tools" exact-active-class="is-current">Todas las herramientas</NuxtLink>
      <NuxtLink to="/tools/calculator" active-class="is-current">Calculadora</NuxtLink>
      <NuxtLink to="/tools/faq" active-class="is-current">Preguntas frecuentes</NuxtLink>
    </nav>

    <NuxtPage />
  </div>
</template>

<style scoped>
.tools-navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin: -0.8rem 0 2.7rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.tools-navigation a {
  padding: 0.35rem 0;
  color: var(--color-muted);
  font-size: 0.83rem;
  font-weight: 650;
  text-decoration: none;
}

.tools-navigation a:hover,
.tools-navigation .is-current {
  color: var(--color-accent-dark);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 0.45rem;
}
</style>
