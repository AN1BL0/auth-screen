<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import BaseButton from '../components/BaseButton.vue'

const router = useRouter()

const { user, logout } = useAuth()

async function handleLogout() {
  await logout()

  await router.push({ name: 'login' })
}
</script>

<template>
  <main class="dashboard">
    <section class="dashboard__card">
      <h1 class="dashboard__title">
        Dashboard
      </h1>

      <p class="dashboard__text">
        You are logged in.
      </p>

      <div
          v-if="user"
          class="dashboard__user"
      >
        <p>
          Name: <strong>{{ user.name }}</strong>
        </p>

        <p>
          Email: <strong>{{ user.email }}</strong>
        </p>
      </div>

      <BaseButton
          type="button"
          @click="handleLogout"
      >
        Log out
      </BaseButton>
    </section>
  </main>
</template>

<style scoped lang="scss">
.dashboard {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  background:
      radial-gradient(circle at top left, rgba(255, 138, 138, 0.18), transparent 32%),
      linear-gradient(135deg, #f3f6fb 0%, #eef2f8 100%);

  &__card {
    width: min(100%, 480px);
    display: grid;
    gap: 18px;
    padding: 40px;
    border-radius: 28px;
    background-color: #ffffff;
    box-shadow: 0 24px 80px rgba(17, 24, 39, 0.12);
  }

  &__title {
    margin: 0;
    font-size: 32px;
    line-height: 1.2;
    font-weight: 800;
  }

  &__text {
    margin: 0;
    color: #8a94a6;
  }

  &__user {
    display: grid;
    gap: 8px;
    padding: 16px;
    border-radius: 16px;
    background-color: #f7f8fb;

    p {
      margin: 0;
    }
  }
}
</style>