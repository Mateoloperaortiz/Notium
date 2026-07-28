<script setup lang="ts">
import AppIcon from '@/components/base/AppIcon.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import type { IconName } from '@/components/base/AppIcon.vue'
import { env } from '@/config/env'
import { RouteName } from '@/router'
import { useAuthStore } from '@/stores/auth.store'

interface Feature {
  icon: IconName
  title: string
  description: string
}

const FEATURES: readonly Feature[] = [
  {
    icon: 'calendar',
    title: 'Semestres organizados',
    description:
      'Registra cada semestre con su ano, periodo y estado, y consulta su promedio ponderado por creditos.',
  },
  {
    icon: 'book',
    title: 'Materias y evaluaciones',
    description:
      'Asocia materias a cada semestre y registra parciales, quices, trabajos y proyectos con su porcentaje.',
  },
  {
    icon: 'chart',
    title: 'Decisiones a tiempo',
    description:
      'Notium calcula la nota acumulada y cuanto necesitas en lo que falta para no perder la materia.',
  },
]

const auth = useAuthStore()
</script>

<template>
  <div class="space-y-16">
    <section class="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <span
          class="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
        >
          Seguimiento academico
        </span>
        <h1 class="mt-4 text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          Entiende tu rendimiento antes de que sea tarde
        </h1>
        <p class="mt-4 text-lg text-ink-500">
          {{ env.appName }} reune tus semestres, materias y calificaciones en un solo panel:
          promedios acumulados, porcentajes evaluados y alertas de materias en riesgo.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink v-if="!auth.isAuthenticated" :to="{ name: RouteName.Login }">
            <BaseButton>Entrar con una cuenta demo</BaseButton>
          </RouterLink>
          <p v-else class="text-sm text-ink-500">
            Ya tienes la sesion de <strong class="text-ink-700">{{ auth.displayName }}</strong>
            abierta.
          </p>
        </div>
      </div>

      <div class="rounded-3xl border border-ink-100 bg-white p-6 shadow-sm">
        <p class="mb-4 text-xs font-semibold tracking-wide text-ink-400 uppercase">
          Ejemplo del panel
        </p>
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-2xl bg-brand-600 p-5 text-white">
            <p class="text-xs font-semibold tracking-wide uppercase opacity-80">Promedio</p>
            <p class="mt-2 text-3xl font-semibold">4.12</p>
            <p class="mt-1 text-xs opacity-80">acumulado de la carrera</p>
          </div>
          <div class="rounded-2xl bg-ink-100 p-5">
            <p class="text-xs font-semibold tracking-wide text-ink-500 uppercase">Creditos</p>
            <p class="mt-2 text-3xl font-semibold text-ink-900">52</p>
            <p class="mt-1 text-xs text-ink-500">cursados hasta hoy</p>
          </div>
          <div class="col-span-2 rounded-2xl border border-ink-100 p-5">
            <p class="text-xs font-semibold tracking-wide text-ink-500 uppercase">
              Materias en riesgo
            </p>
            <div class="mt-3 space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-ink-700">Analisis de algoritmos</span>
                <span class="font-medium text-rose-600">necesita 3.9</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-ink-700">Seguridad informatica</span>
                <span class="font-medium text-amber-600">necesita 3.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 md:grid-cols-3">
      <article
        v-for="feature in FEATURES"
        :key="feature.title"
        class="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm"
      >
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700"
        >
          <AppIcon :name="feature.icon" />
        </span>
        <h2 class="mt-4 text-base font-semibold text-ink-900">{{ feature.title }}</h2>
        <p class="mt-2 text-sm text-ink-500">{{ feature.description }}</p>
      </article>
    </section>

    <section class="rounded-3xl bg-ink-900 px-8 py-12 text-center text-white">
      <h2 class="text-2xl font-semibold tracking-tight">Empieza con datos de ejemplo</h2>
      <p class="mx-auto mt-3 max-w-2xl text-ink-300">
        La primera vez que abres {{ env.appName }} se crean semestres, materias y notas ficticias en
        el navegador para que puedas recorrer la aplicacion sin registrar nada.
      </p>
      <RouterLink :to="{ name: RouteName.Login }" class="mt-6 inline-block">
        <BaseButton variant="secondary">Iniciar sesion</BaseButton>
      </RouterLink>
    </section>
  </div>
</template>
