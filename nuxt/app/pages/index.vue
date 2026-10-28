<script setup lang="ts">
// Lifecycle
useSeoMeta({
  title: 'Tu semestre, con claridad',
  description:
    'Organiza tu vida académica con Notium: consulta materias, encuentra consejos de estudio y calcula la nota que necesitas.',
});
</script>

<template>
  <div>
    <section class="home-hero" aria-labelledby="home-title">
      <div class="home-hero__copy">
        <p class="eyebrow">Tu espacio académico</p>
        <h1 id="home-title" class="page-heading">
          Menos caos.<br />
          <span>Más claridad.</span>
        </h1>
        <p class="lead">
          Dale dirección a tu semestre. Conoce tus materias, encuentra una mejor forma de estudiar y
          toma decisiones con tus notas a la vista.
        </p>
        <div class="home-hero__actions">
          <NuxtLink class="button" to="/subjects">
            Explorar materias <span aria-hidden="true">→</span>
          </NuxtLink>
          <NuxtLink class="button button--secondary" to="/tools/calculator">
            Calcular mi nota
          </NuxtLink>
        </div>
        <p class="home-hero__note">Un paso a la vez. Un semestre con intención.</p>
      </div>

      <aside class="semester-preview" aria-label="Ejemplo de planeación de una materia">
        <div class="semester-preview__top">
          <span class="eyebrow">Tu próximo paso</span>
          <span class="semester-preview__tag">Ejemplo</span>
        </div>
        <div class="semester-preview__illustration" aria-hidden="true">
          <span class="semester-preview__line semester-preview__line--one"></span>
          <span class="semester-preview__line semester-preview__line--two"></span>
          <span class="semester-preview__line semester-preview__line--three"></span>
          <span class="semester-preview__spark">✦</span>
        </div>
        <h2>El objetivo está más cerca<br />cuando sabes dónde estás.</h2>
        <div class="semester-preview__numbers">
          <div><strong>4,0</strong><span>Promedio actual</span></div>
          <div><strong>60 %</strong><span>Evaluado</span></div>
          <div><strong>3,0</strong><span>Meta final</span></div>
        </div>
        <p>Con este ejemplo, necesitas promediar <strong>1,50</strong> en el 40 % restante.</p>
        <NuxtLink to="/tools/calculator"
          >Haz el cálculo con tus notas <span aria-hidden="true">↗</span></NuxtLink
        >
      </aside>
    </section>

    <section class="home-paths" aria-labelledby="home-paths-title">
      <div class="home-paths__heading">
        <p class="eyebrow">A tu ritmo</p>
        <h2 id="home-paths-title">Un lugar para cada parte del semestre.</h2>
      </div>
      <div class="card-grid">
        <article class="card home-path">
          <span class="home-path__number" aria-hidden="true">01 /</span>
          <h3>Encuentra tu enfoque</h3>
          <p>Ideas prácticas para organizar el tiempo, estudiar y cuidar tu ritmo académico.</p>
          <NuxtLink to="/blog">Leer el blog <span aria-hidden="true">→</span></NuxtLink>
        </article>
        <article class="card home-path">
          <span class="home-path__number" aria-hidden="true">02 /</span>
          <h3>Conoce tus materias</h3>
          <p>Explora el catálogo de ejemplo y revisa créditos, docentes y semestres.</p>
          <NuxtLink to="/subjects">Ver materias <span aria-hidden="true">→</span></NuxtLink>
        </article>
        <article class="card home-path">
          <span class="home-path__number" aria-hidden="true">03 /</span>
          <h3>Planea tu siguiente nota</h3>
          <p>Convierte tus resultados actuales en una meta concreta para lo que falta.</p>
          <NuxtLink to="/tools">Abrir herramientas <span aria-hidden="true">→</span></NuxtLink>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  align-items: center;
  gap: clamp(2rem, 6vw, 5rem);
  padding: 1rem 0 4.5rem;
}

.home-hero .page-heading {
  font-size: clamp(3rem, 6.7vw, 5.1rem);
}

.home-hero .page-heading span {
  color: var(--color-accent);
}

.home-hero .lead {
  max-width: 31rem;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.home-hero__note {
  margin: 1.5rem 0 0;
  color: var(--color-muted);
  font-size: 0.75rem;
}

.semester-preview {
  padding: clamp(1.5rem, 3vw, 2.1rem);
  border: 1px solid #ccdbce;
  border-radius: 1.4rem;
  background: linear-gradient(145deg, #eef2e9, #e6eee4);
  box-shadow: var(--shadow-card);
}

.semester-preview__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.semester-preview__top .eyebrow {
  margin: 0;
}

.semester-preview__tag {
  padding: 0.2rem 0.55rem;
  border: 1px solid #bccfbe;
  border-radius: 999px;
  color: var(--color-accent-dark);
  font-size: 0.65rem;
  font-weight: 700;
}

.semester-preview__illustration {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 10rem;
  gap: 0.6rem;
  padding: 1.5rem 0;
}

.semester-preview__line {
  width: 2.4rem;
  border-radius: 0.4rem 0.4rem 0 0;
  background: var(--color-accent);
}

.semester-preview__line--one {
  height: 2.5rem;
  background: #adc6af;
}

.semester-preview__line--two {
  height: 4rem;
  background: #6c9b7b;
}

.semester-preview__line--three {
  height: 5.5rem;
}

.semester-preview__spark {
  position: absolute;
  top: 0.6rem;
  left: calc(50% + 3.4rem);
  color: #9a681d;
  font-size: 1.7rem;
}

.semester-preview h2 {
  margin-bottom: 1.5rem;
  font-size: clamp(1.3rem, 2.5vw, 1.6rem);
}

.semester-preview__numbers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.7rem;
  padding: 1rem 0;
  border-top: 1px solid #c5d6c5;
  border-bottom: 1px solid #c5d6c5;
}

.semester-preview__numbers strong,
.semester-preview__numbers span {
  display: block;
}

.semester-preview__numbers strong {
  font-family: var(--font-display);
  font-size: 1.55rem;
  letter-spacing: -0.06em;
}

.semester-preview__numbers span {
  color: #4c6255;
  font-size: 0.66rem;
}

.semester-preview > p {
  margin: 1.2rem 0 0.8rem;
  color: #4c6255;
  font-size: 0.83rem;
}

.semester-preview > a,
.home-path a {
  font-size: 0.85rem;
  font-weight: 750;
  text-decoration: none;
}

.semester-preview > a:hover,
.home-path a:hover {
  text-decoration: underline;
}

.home-paths {
  padding-top: 2.7rem;
  border-top: 1px solid var(--color-border);
}

.home-paths__heading h2 {
  margin-bottom: 0;
}

.home-path {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.home-path__number {
  margin-bottom: 1.6rem;
  color: var(--color-accent);
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.08em;
}

.home-path p {
  flex: 1;
  font-size: 0.9rem;
}

@media (max-width: 800px) {
  .home-hero {
    grid-template-columns: 1fr;
    padding: 0 0 3rem;
  }

  .semester-preview {
    max-width: 36rem;
  }
}
</style>
