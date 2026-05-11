<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AuthCard from '../components/AuthCard.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseField from '../components/BaseField.vue'

interface ForgotPasswordForm {
  email: string
}

interface ForgotPasswordErrors {
  email: string
}

const form = reactive<ForgotPasswordForm>({
  email: '',
})

const errors = reactive<ForgotPasswordErrors>({
  email: '',
})

const isSubmitted = ref(false)

const isFormFilled = computed(() => {
  return Boolean(form.email.trim())
})

function validateForm(): boolean {
  errors.email = ''

  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!form.email.includes('@')) {
    errors.email = 'Enter a valid email'
  }

  return !errors.email
}

function handleSubmit() {
  const isValid = validateForm()

  if (!isValid) return

  isSubmitted.value = true
}
</script>

<template>
  <AuthCard>
    <div class="forgot-password">
      <header class="forgot-password__header">
        <h1 class="forgot-password__title">
          Forgot password?
        </h1>

        <p class="forgot-password__subtitle">
          Enter your email and we’ll send you instructions to reset your password.
        </p>
      </header>

      <form
          v-if="!isSubmitted"
          class="forgot-password__form"
          @submit.prevent="handleSubmit"
      >
        <BaseField
            id="forgot-email"
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            :error="errors.email"
        />

        <BaseButton
            type="submit"
            :disabled="!isFormFilled"
        >
          Send reset link
        </BaseButton>

        <p class="forgot-password__back">
          Remember your password?

          <RouterLink
              class="forgot-password__link"
              :to="{ name: 'login' }"
          >
            Log In
          </RouterLink>
        </p>
      </form>

      <div
          v-else
          class="forgot-password__success"
      >
        <p>
          We sent password reset instructions to:
        </p>

        <strong>
          {{ form.email }}
        </strong>

        <RouterLink
            class="forgot-password__link"
            :to="{ name: 'login' }"
        >
          Back to login
        </RouterLink>
      </div>
    </div>
  </AuthCard>
</template>

<style scoped lang="scss">
.forgot-password {
  &__header {
    margin-bottom: 32px;
    text-align: center;
  }

  &__title {
    margin: 0 0 8px;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: -0.04em;
  }

  &__subtitle {
    margin: 0;
    color: #8a94a6;
    font-size: 14px;
    line-height: 1.5;
  }

  &__form {
    display: grid;
    gap: 18px;
  }

  &__back {
    margin: 0;
    color: #8a94a6;
    font-size: 14px;
    text-align: center;
  }

  &__link {
    color: #ff477e;
    font-weight: 700;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__success {
    display: grid;
    gap: 12px;
    text-align: center;
    color: #4b5563;

    p {
      margin: 0;
    }

    strong {
      color: #111827;
    }
  }
}
</style>