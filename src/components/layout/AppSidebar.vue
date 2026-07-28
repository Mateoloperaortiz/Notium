<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import AppIcon from '@/components/base/AppIcon.vue'
import type { IconName } from '@/components/base/AppIcon.vue'
import { routes } from '@/router/routes'
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()

/** La navegacion se deriva de las rutas: agregar una vista no exige tocar el menu. */
const visibleRoutes = computed<RouteRecordRaw[]>(() =>
  routes.filter((route) => {
    if (route.meta?.inSidebar !== true) {
      return false
    }

    const allowedRoles = route.meta.roles
    if (allowedRoles === undefined) {
      return true
    }

    const role = auth.currentUser?.role
    return role !== undefined && allowedRoles.includes(role)
  }),
)

function iconFor(route: RouteRecordRaw): IconName {
  return (route.meta?.icon ?? 'grid') as IconName
}
</script>

<template>
  <aside class="w-full shrink-0 lg:w-60">
    <nav class="flex gap-1 overflow-x-auto lg:sticky lg:top-20 lg:flex-col lg:overflow-visible">
      <RouterLink
        v-for="route in visibleRoutes"
        :key="String(route.name)"
        :to="{ name: route.name }"
        class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-ink-600 transition-colors hover:bg-white hover:text-ink-900"
        active-class="bg-white text-brand-700 shadow-sm ring-1 ring-ink-100"
      >
        <AppIcon :name="iconFor(route)" :size="18" />
        {{ route.meta?.title }}
      </RouterLink>
    </nav>
  </aside>
</template>
