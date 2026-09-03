<script setup lang="ts">
import type Semester from '@/models/Semester';
import DateFormatUtil from '@/utils/DateFormatUtil';
import { RouterLink } from 'vue-router';

interface Props {
  semester: Semester;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  delete: [semesterId: string];
  edit: [semester: Semester];
}>();

const handleDelete = (): void => {
  emit('delete', props.semester.getId());
};

const handleEdit = (): void => {
  emit('edit', props.semester);
};
</script>

<template>
  <article class="semester-card">
    <div class="semester-card__accent" aria-hidden="true"></div>

    <header class="semester-card__header">
      <div class="semester-card__identity">
        <span class="semester-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 3v3M17 3v3M4 9h16" />
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M8 13h3M13 13h3M8 17h3" />
          </svg>
        </span>

        <div>
          <p class="semester-card__eyebrow">Periodo académico</p>
          <h2 class="semester-card__title">{{ semester.getName() }}</h2>
        </div>
      </div>

      <span class="semester-card__status">
        <span class="semester-card__status-dot" aria-hidden="true"></span>
        Registrado
      </span>
    </header>

    <dl class="semester-card__dates" aria-label="Fechas del semestre">
      <div class="semester-card__date">
        <dt>Inicio</dt>
        <dd>
          <time :datetime="semester.getStartDate()">
            {{ DateFormatUtil.formatDate(semester.getStartDate()) }}
          </time>
        </dd>
      </div>

      <div class="semester-card__date-divider" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="m7 5 5 5-5 5" />
        </svg>
      </div>

      <div class="semester-card__date">
        <dt>Finalización</dt>
        <dd>
          <time :datetime="semester.getEndDate()">
            {{ DateFormatUtil.formatDate(semester.getEndDate()) }}
          </time>
        </dd>
      </div>
    </dl>

    <footer class="semester-card__actions">
      <RouterLink
        class="semester-card__action semester-card__action--primary"
        :to="{ name: 'semester-show', params: { id: semester.getId() } }"
        :aria-label="`Ver detalle de ${semester.getName()}`"
      >
        Ver detalle
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m7 5 5 5-5 5" />
        </svg>
      </RouterLink>

      <div class="semester-card__secondary-actions">
        <button
          class="semester-card__icon-button"
          type="button"
          :aria-label="`Editar ${semester.getName()}`"
          @click="handleEdit"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m13.8 3.7 2.5 2.5M4 16l3.1-.6 9.2-9.2a1.8 1.8 0 0 0-2.5-2.5l-9.2 9.2L4 16Z" />
          </svg>
        </button>

        <button
          class="semester-card__icon-button semester-card__icon-button--danger"
          type="button"
          :aria-label="`Eliminar ${semester.getName()}`"
          @click="handleDelete"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 6h12M8 3h4l1 3H7l1-3ZM6 6l.7 11h6.6L14 6M8.5 9v5M11.5 9v5" />
          </svg>
        </button>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.semester-card {
  --card-accent: var(--color-accent, #236b56);
  --card-border: var(--color-border, #e3e8f0);
  --card-muted: var(--color-muted, #667085);
  --card-surface: var(--color-surface, #ffffff);
  --card-text: var(--color-ink, #182230);
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1.35rem;
  overflow: hidden;
  padding: 1.4rem;
  border: 1px solid var(--card-border);
  border-radius: 1rem;
  background: var(--card-surface);
  box-shadow:
    0 1px 2px rgb(16 24 40 / 4%),
    0 8px 24px rgb(16 24 40 / 4%);
  color: var(--card-text);
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.semester-card:hover {
  border-color: color-mix(in srgb, var(--card-accent) 28%, var(--card-border));
  box-shadow:
    0 2px 4px rgb(16 24 40 / 5%),
    0 16px 36px rgb(16 24 40 / 8%);
  transform: translateY(-2px);
}

.semester-card__accent {
  position: absolute;
  inset: 0 auto 0 0;
  width: 0.25rem;
  background: linear-gradient(180deg, var(--card-accent), var(--color-highlight, #e7a547));
}

.semester-card__header,
.semester-card__identity,
.semester-card__actions,
.semester-card__secondary-actions {
  display: flex;
  align-items: center;
}

.semester-card__header {
  justify-content: space-between;
  gap: 1rem;
}

.semester-card__identity {
  min-width: 0;
  gap: 0.8rem;
}

.semester-card__icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 0.8rem;
  background: color-mix(in srgb, var(--card-accent) 10%, white);
  color: var(--card-accent);
}

.semester-card__icon svg {
  width: 1.4rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.semester-card__eyebrow {
  margin: 0 0 0.2rem;
  color: var(--card-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.075em;
  line-height: 1.2;
  text-transform: uppercase;
}

.semester-card__title {
  overflow: hidden;
  margin: 0;
  color: var(--card-text);
  font-family: var(--font-display, inherit);
  font-size: 1.12rem;
  font-weight: 720;
  letter-spacing: -0.02em;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.semester-card__status {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.4rem;
  padding: 0.32rem 0.58rem;
  border-radius: 999px;
  background: #ecfdf3;
  color: #067647;
  font-size: 0.72rem;
  font-weight: 700;
}

.semester-card__status-dot {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: #17b26a;
  box-shadow: 0 0 0 3px rgb(23 178 106 / 12%);
}

.semester-card__dates {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 0.85rem;
  margin: 0;
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--card-border) 74%, transparent);
  border-radius: 0.8rem;
  background: color-mix(in srgb, var(--color-background, #f4f1e9) 65%, white);
}

.semester-card__date {
  min-width: 0;
}

.semester-card__date dt {
  margin-bottom: 0.25rem;
  color: var(--card-muted);
  font-size: 0.74rem;
  font-weight: 650;
  letter-spacing: 0.02em;
}

.semester-card__date dd {
  margin: 0;
  color: var(--card-text);
  font-size: 0.9rem;
  font-weight: 650;
  line-height: 1.35;
}

.semester-card__date-divider {
  display: grid;
  width: 1.65rem;
  height: 1.65rem;
  place-items: center;
  border-radius: 50%;
  background: var(--card-surface);
  color: var(--card-muted);
  box-shadow: 0 0 0 1px var(--card-border);
}

.semester-card__date-divider svg {
  width: 0.95rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.semester-card__actions {
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.1rem;
}

.semester-card__action {
  display: inline-flex;
  min-height: 2.45rem;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 0.85rem;
  border-radius: 0.65rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  transition:
    background-color 160ms ease,
    box-shadow 160ms ease,
    color 160ms ease;
}

.semester-card__action svg {
  width: 1rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  transition: transform 160ms ease;
}

.semester-card__action--primary {
  background: color-mix(in srgb, var(--card-accent) 10%, white);
  color: var(--card-accent);
}

.semester-card__action--primary:hover {
  background: color-mix(in srgb, var(--card-accent) 16%, white);
}

.semester-card__action--primary:hover svg {
  transform: translateX(2px);
}

.semester-card__secondary-actions {
  gap: 0.45rem;
}

.semester-card__icon-button {
  display: grid;
  width: 2.45rem;
  height: 2.45rem;
  padding: 0;
  place-items: center;
  border: 1px solid var(--card-border);
  border-radius: 0.65rem;
  background: var(--card-surface);
  color: var(--card-muted);
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.semester-card__icon-button svg {
  width: 1.05rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.semester-card__icon-button:hover {
  border-color: color-mix(in srgb, var(--card-accent) 26%, var(--card-border));
  background: color-mix(in srgb, var(--card-accent) 6%, white);
  color: var(--card-accent);
}

.semester-card__icon-button--danger:hover {
  border-color: #fecaca;
  background: #fef2f2;
  color: #d92d20;
}

.semester-card__action:focus-visible,
.semester-card__icon-button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--card-accent) 28%, transparent);
  outline-offset: 2px;
}

@media (max-width: 34rem) {
  .semester-card__header {
    align-items: flex-start;
  }

  .semester-card__status {
    padding-inline: 0.45rem;
    font-size: 0;
  }

  .semester-card__status-dot {
    width: 0.5rem;
    height: 0.5rem;
  }

  .semester-card__dates {
    grid-template-columns: 1fr;
  }

  .semester-card__date-divider {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .semester-card,
  .semester-card__action,
  .semester-card__action svg,
  .semester-card__icon-button {
    transition: none;
  }

  .semester-card:hover {
    transform: none;
  }
}
</style>
