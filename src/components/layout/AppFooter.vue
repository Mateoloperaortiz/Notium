<script setup lang="ts">
import { env } from '@/config/env'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-ink-100 bg-white">
    <div
      class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-ink-500 sm:flex-row sm:px-6"
    >
      <p>{{ env.appName }} · Seguimiento del proceso academico</p>
      <p>Proyecto academico {{ currentYear }} · Datos almacenados en LocalStorage</p>
    </div>
  </footer>
</template>
