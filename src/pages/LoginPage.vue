<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthCard from '../components/AuthCard.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseField from '../components/BaseField.vue'

interface LoginForm {
  email: string
  password: string
}

interface LoginErrors {
  email: string
  password: string
}

const router = useRouter()

const { login } = useAuth()

const form = reactive<LoginForm>({
  email: '',
  password: '',
})

const errors = reactive<LoginErrors>({
  email: '',
  password: '',
})

const isPasswordVisible = ref(false)

const passwordInputType = computed(() => {
  return isPasswordVisible.value ? 'text' : 'password'
})

const isFormFilled = computed(() => {
  return Boolean(form.email.trim() && form.password.trim())
})

function validateForm() {
  errors.email = ''
  errors.password = ''

  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!form.email.includes('@')) {
    errors.email = 'Enter a valid email'
  }

  if (!form.password.trim()) {
    errors.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  return !errors.email && !errors.password
}

const serverError = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  const isValid = validateForm()

  if (!isValid) return

  serverError.value = ''
  isLoading.value = true

  try {
    await login({
      email: form.email,
      password: form.password,
    })

    await router.push({ name: 'dashboard' })
  } catch (error) {
    serverError.value =
        error instanceof Error ? error.message : 'Login failed'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AuthCard>
    <div class="login">
      <header class="login__header">
        <h1 class="login__title">
          Welcome back!
        </h1>

        <p class="login__subtitle">
          Please enter your details to sign in.
        </p>
      </header>

      <form
          class="login__form"
          @submit.prevent="handleSubmit"
      >
        <BaseField
            id="email"
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            :error="errors.email"
        />

        <BaseField
            id="password"
            v-model="form.password"
            label="Password"
            :type="passwordInputType"
            placeholder="Enter password"
            :error="errors.password"
        >
          <template #action>
            <RouterLink
                class="login__forgot-link"
                :to="{ name: 'forgot-password' }"
            >
              Forgot Password?
            </RouterLink>
          </template>

          <template #suffix>
            <button
                class="login__password-button"
                type="button"
                @click="isPasswordVisible = !isPasswordVisible"
            >
              {{ isPasswordVisible ? 'Hide' : 'Show' }}
            </button>
          </template>
        </BaseField>

        <p
            v-if="serverError"
            class="login__server-error"
        >
          {{ serverError }}
        </p>

        <BaseButton
            type="submit"
            :disabled="!isFormFilled || isLoading"
        >
          {{ isLoading ? 'Logging in...' : 'Log In' }}
        </BaseButton>

        <BaseButton
            type="button"
            variant="secondary"
        >
          Login with Google
        </BaseButton>

        <div class="login__divider">
          <span>or login with SSO</span>
        </div>
        <p class="login__register">
          Don’t have an account?

          <RouterLink
              class="login__register-link"
              :to="{ name: 'register' }"
          >
            Sign Up
          </RouterLink>
        </p>
      </form>
    </div>
  </AuthCard>
</template>

<style scoped lang="scss">
.login {
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

  &__forgot-link {
    color: #ff477e;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__password-button {
    flex-shrink: 0;
    padding: 0;
    border: 0;
    background-color: transparent;
    color: #8a94a6;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  &__divider {
    position: relative;
    display: flex;
    justify-content: center;
    color: #8a94a6;
    font-size: 13px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 31%;
      height: 1px;
      background-color: #edf0f5;
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }

    &__register {
      margin: 0;
      color: #8a94a6;
      font-size: 14px;
      text-align: center;
    }

    &__register-link {
      color: #ff477e;
      font-weight: 700;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    span {
      position: relative;
      z-index: 1;
      padding-inline: 12px;
      background-color: #ffffff;
    }
  }

  &__server-error {
    margin: 0;
    color: #ef4444;
    font-size: 13px;
    text-align: center;
  }
}
</style>