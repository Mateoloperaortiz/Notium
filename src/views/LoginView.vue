<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseField from '@/components/base/BaseField.vue'
import { useToast } from '@/composables/useToast'
import { RouteName } from '@/router'
import { useAuthStore } from '@/stores/auth.store'

interface DemoAccount {
  label: string
  email: string
  password: string
}

/** Cuentas creadas por el `SeedService` para facilitar la revision del proyecto. */
const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  { label: 'Estudiante', email: 'mateo@notium.dev', password: 'notium123' },
  { label: 'Estudiante 2', email: 'samuel@notium.dev', password: 'notium123' },
  { label: 'Administrador', email: 'admin@notium.dev', password: 'admin123' },
]

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const { success } = useToast()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

function useAccount(account: DemoAccount): void {
  email.value = account.email
  password.value = account.password
  errorMessage.value = ''
}

async function submit(): Promise<void> {
  isSubmitting.value = true
  errorMessage.value = ''

  const error = await auth.login({ email: email.value, password: password.value })
  isSubmitting.value = false

  if (error !== null) {
    errorMessage.value = error
    return
  }

  success(`Bienvenido, ${auth.displayName}.`)
  const redirect = route.query.redirect
  await router.push(typeof redirect === 'string' ? redirect : { name: RouteName.Home })
}
</script>

<template>
  <div class="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
    <section class="hidden lg:block">
      <h1 class="text-3xl font-semibold tracking-tight text-ink-900">
        Tu proceso academico, en un solo lugar
      </h1>
      <p class="mt-3 text-ink-500">
        Consulta tus semestres, el peso de cada evaluacion y cuanto necesitas en lo que falta para
        aprobar.
      </p>
      <ul class="mt-6 space-y-2 text-sm text-ink-600">
        <li>· Nota acumulada y proyectada por materia</li>
        <li>· Promedio ponderado por creditos en cada semestre</li>
        <li>· Alertas de materias en riesgo</li>
      </ul>
    </section>

    <section class="rounded-2xl border border-ink-100 bg-white p-8 shadow-sm">
      <h2 class="text-xl font-semibold text-ink-900">Iniciar sesion</h2>
      <p class="mt-1 text-sm text-ink-500">Usa una de las cuentas de demostracion.</p>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <BaseField v-slot="{ fieldId }" label="Correo electronico" required>
          <input
            :id="fieldId"
            v-model.trim="email"
            type="email"
            autocomplete="email"
            required
            placeholder="estudiante@notium.dev"
            class="field-input"
          />
        </BaseField>

        <BaseField v-slot="{ fieldId }" label="Contrasena" required>
          <input
            :id="fieldId"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="field-input"
          />
        </BaseField>

        <p v-if="errorMessage !== ''" class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {{ errorMessage }}
        </p>

        <BaseButton type="submit" block :disabled="isSubmitting">
          {{ isSubmitting ? 'Verificando...' : 'Entrar' }}
        </BaseButton>
      </form>

      <div class="mt-6 border-t border-ink-100 pt-5">
        <p class="text-xs font-semibold tracking-wide text-ink-500 uppercase">
          Cuentas de demostracion
        </p>
        <div class="mt-3 flex flex-wrap gap-2">
          <BaseButton
            v-for="account in DEMO_ACCOUNTS"
            :key="account.email"
            variant="secondary"
            size="sm"
            @click="useAccount(account)"
          >
            {{ account.label }}
          </BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>
