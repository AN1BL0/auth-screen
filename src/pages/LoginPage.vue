<script setup lang="ts">
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

function handleSubmit() {
  const isValid = validateForm()

  if (!isValid) return

  router.push({ name: 'dashboard' })
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
            <a
                class="login__forgot-link"
                href="#"
            >
              Forgot Password?
            </a>
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

        <BaseButton
            type="submit"
            :disabled="!isFormFilled"
        >
          Log In
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

    span {
      position: relative;
      z-index: 1;
      padding-inline: 12px;
      background-color: #ffffff;
    }
  }
}
</style>