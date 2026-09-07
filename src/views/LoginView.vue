<script setup lang="ts">
import { AuthService } from '@/services/AuthService.js';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const email = ref<string>('mateo@example.com');
const password = ref<string>('mateo-password');
const errorMessage = ref<string>('');
const route = useRoute();
const router = useRouter();

const submitLogin = (): void => {
  errorMessage.value = '';

  const user = AuthService.login({
    email: email.value,
    password: password.value,
  });

  if (user === null) {
    errorMessage.value = 'El correo o la contraseña no son correctos.';
    return;
  }

  const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : '/';
  void router.push(redirectPath);
};
</script>

<template>
  <section class="login-view" aria-labelledby="login-title">
    <div class="login-panel">
      <p class="eyebrow">Acceso a Notium</p>
      <h1 id="login-title" class="page-title">Iniciar sesión</h1>
      <p class="page-description">Ingresa con tu cuenta académica para continuar.</p>

      <form class="login-form" @submit.prevent="submitLogin">
        <label class="login-form__field">
          <span>Correo electrónico</span>
          <input v-model="email" type="email" autocomplete="email" required />
        </label>

        <label class="login-form__field">
          <span>Contraseña</span>
          <input v-model="password" type="password" autocomplete="current-password" required />
        </label>

        <p v-if="errorMessage" class="login-form__error" role="alert">{{ errorMessage }}</p>

        <button class="button button--primary" type="submit">Entrar</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.login-view {
  display: grid;
  min-height: calc(100vh - 13rem);
  place-items: center;
}

.login-panel {
  width: min(100%, 28rem);
  padding: clamp(1.5rem, 5vw, 2.5rem);
  border: 1px solid rgba(25, 51, 44, 0.1);
  border-radius: 1.25rem;
  background: rgba(255, 253, 248, 0.88);
  box-shadow: var(--shadow-card);
}

.login-form {
  display: grid;
  gap: 1.1rem;
  margin-top: 2rem;
}

.login-form__field {
  display: grid;
  gap: 0.4rem;
  color: var(--color-ink);
  font-size: 0.86rem;
  font-weight: 700;
}

.login-form__field input {
  width: 100%;
  min-height: 2.85rem;
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 0.7rem;
  background: var(--color-white);
  color: var(--color-ink);
}

.login-form__field input:focus {
  border-color: var(--color-accent);
  outline: 3px solid rgba(35, 107, 86, 0.16);
}

.login-form__error {
  margin: 0;
  color: var(--color-danger);
  font-size: 0.86rem;
}

.login-form .button {
  width: 100%;
  margin-top: 0.35rem;
}
</style>
