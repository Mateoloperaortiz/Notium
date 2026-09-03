<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <section class="dashboard" aria-labelledby="dashboard-title">
    <div class="dashboard__copy">
      <p class="eyebrow">Tu espacio académico</p>
      <h1 id="dashboard-title" class="page-title">
        Menos caos.<br />
        Más claridad.
      </h1>
      <p class="page-description">
        Notium reúne tu recorrido universitario para que puedas concentrarte en avanzar. Empieza
        organizando tus periodos académicos.
      </p>

      <div class="dashboard__actions">
        <RouterLink class="button button--primary" :to="{ name: 'semester-index' }">
          Ver mis semestres
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </div>

    <aside class="dashboard-preview" aria-label="Estado del proyecto">
      <div class="dashboard-preview__topline">
        <span>HOY</span>
        <span class="dashboard-preview__status">Base inicial</span>
      </div>

      <div class="dashboard-preview__focus">
        <span class="dashboard-preview__icon" aria-hidden="true">◎</span>
        <div>
          <p>Enfoque actual</p>
          <strong>Organiza tus semestres</strong>
        </div>
      </div>

      <div class="dashboard-preview__divider"></div>

      <div class="dashboard-preview__next">
        <span>Próximamente</span>
        <p>
          El dashboard mostrará tu promedio, créditos y progreso cuando los demás módulos estén
          listos.
        </p>
      </div>
    </aside>
  </section>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(18rem, 0.85fr);
  align-items: center;
  min-height: calc(100vh - 13rem);
  gap: clamp(3rem, 8vw, 7rem);
}

.dashboard__copy {
  padding: 1rem 0;
}

.dashboard__actions {
  display: flex;
  margin-top: 2rem;
}

.dashboard__actions .button {
  gap: 1.4rem;
}

.dashboard-preview {
  position: relative;
  padding: 1.6rem;
  overflow: hidden;
  border: 1px solid rgba(25, 51, 44, 0.09);
  border-radius: 1.5rem;
  background: rgba(255, 253, 248, 0.86);
  box-shadow: var(--shadow-card);
}

.dashboard-preview::before {
  position: absolute;
  top: -4rem;
  right: -3rem;
  width: 9rem;
  height: 9rem;
  border-radius: 50%;
  background: rgba(231, 165, 71, 0.13);
  content: '';
}

.dashboard-preview__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-muted);
  font-size: 0.69rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.dashboard-preview__status {
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  background: var(--color-accent-light);
  color: var(--color-accent-dark);
  letter-spacing: 0.02em;
  text-transform: none;
}

.dashboard-preview__focus {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 3.5rem 0 2.5rem;
}

.dashboard-preview__icon {
  display: grid;
  flex: 0 0 auto;
  width: 3.6rem;
  height: 3.6rem;
  place-items: center;
  border-radius: 1.1rem;
  background: var(--color-ink);
  color: #fff7e5;
  font-size: 1.7rem;
}

.dashboard-preview__focus p,
.dashboard-preview__next p {
  margin: 0;
  color: var(--color-muted);
}

.dashboard-preview__focus strong {
  display: block;
  margin-top: 0.25rem;
  font-family: var(--font-display);
  font-size: 1.18rem;
}

.dashboard-preview__divider {
  height: 1px;
  background: var(--color-border);
}

.dashboard-preview__next {
  padding-top: 1.25rem;
}

.dashboard-preview__next span {
  color: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dashboard-preview__next p {
  margin-top: 0.55rem;
  font-size: 0.9rem;
  line-height: 1.65;
}

@media (max-width: 800px) {
  .dashboard {
    grid-template-columns: 1fr;
    min-height: auto;
    gap: 3rem;
  }
}
</style>
