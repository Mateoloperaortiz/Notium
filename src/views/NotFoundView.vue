<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import { RouteName } from '@/router'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="mx-auto max-w-lg py-16 text-center">
    <p class="text-6xl font-semibold text-brand-600">404</p>
    <h1 class="mt-4 text-2xl font-semibold text-ink-900">Esta pagina no existe</h1>
    <p class="mt-2 text-ink-500">
      Revisa la direccion o vuelve al inicio para seguir con tu seguimiento academico.
    </p>
    <div class="mt-6 flex justify-center gap-3">
      <BaseButton variant="secondary" @click="router.back()">Volver atras</BaseButton>
      <BaseButton @click="router.push({ name: RouteName.Home })">Ir al inicio</BaseButton>
    </div>
  </div>
</template>
