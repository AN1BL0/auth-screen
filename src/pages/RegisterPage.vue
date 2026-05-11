<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthCard from '../components/AuthCard.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseField from '../components/BaseField.vue'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface RegisterErrors {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreement: string
}

const router = useRouter()

const { register } = useAuth()

const form = reactive<RegisterForm>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive<RegisterErrors>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: '',
})

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const isAgreementAccepted = ref(false)

const passwordInputType = computed(() => {
  return isPasswordVisible.value ? 'text' : 'password'
})

const confirmPasswordInputType = computed(() => {
  return isConfirmPasswordVisible.value ? 'text' : 'password'
})

const isFormFilled = computed(() => {
  return Boolean(
      form.name.trim() &&
      form.email.trim() &&
      form.password.trim() &&
      form.confirmPassword.trim() &&
      isAgreementAccepted.value,
  )
})

function validateForm(): boolean {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.agreement = ''

  if (!form.name.trim()) {
    errors.name = 'Name is required'
  }

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

  if (!form.confirmPassword.trim()) {
    errors.confirmPassword = 'Confirm password is required'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (!isAgreementAccepted.value) {
    errors.agreement = 'You must accept the terms'
  }

  return (
      !errors.name &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword &&
      !errors.agreement
  )
}

function handleSubmit() {
  const isValid = validateForm()

  if (!isValid) return

  const isRegistered = register({
    name: form.name,
    email: form.email,
    password: form.password,
  })

  if (!isRegistered) return

  router.push({ name: 'dashboard' })
}
</script>

<template>
  <AuthCard>
    <div class="register">
      <header class="register__header">
        <h1 class="register__title">
          Create account
        </h1>

        <p class="register__subtitle">
          Please fill in your details to create an account.
        </p>
      </header>

      <form
          class="register__form"
          @submit.prevent="handleSubmit"
      >
        <BaseField
            id="name"
            v-model="form.name"
            label="Name"
            placeholder="Enter your name"
            :error="errors.name"
        />

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
            placeholder="Create password"
            :error="errors.password"
        >
          <template #suffix>
            <button
                class="register__password-button"
                type="button"
                @click="isPasswordVisible = !isPasswordVisible"
            >
              {{ isPasswordVisible ? 'Hide' : 'Show' }}
            </button>
          </template>
        </BaseField>

        <BaseField
            id="confirm-password"
            v-model="form.confirmPassword"
            label="Confirm password"
            :type="confirmPasswordInputType"
            placeholder="Repeat password"
            :error="errors.confirmPassword"
        >
          <template #suffix>
            <button
                class="register__password-button"
                type="button"
                @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
            >
              {{ isConfirmPasswordVisible ? 'Hide' : 'Show' }}
            </button>
          </template>
        </BaseField>

        <label class="register__agreement">
          <input
              v-model="isAgreementAccepted"
              type="checkbox"
          />

          <span>
            I agree with Terms and Privacy Policy
          </span>
        </label>

        <p
            v-if="errors.agreement"
            class="register__error"
        >
          {{ errors.agreement }}
        </p>

        <BaseButton
            type="submit"
            :disabled="!isFormFilled"
        >
          Sign Up
        </BaseButton>

        <BaseButton
            type="button"
            variant="secondary"
        >
          Sign up with Google
        </BaseButton>

        <p class="register__login">
          Already have an account?

          <RouterLink
              class="register__login-link"
              :to="{ name: 'login' }"
          >
            Log In
          </RouterLink>
        </p>
      </form>
    </div>
  </AuthCard>
</template>

<style scoped lang="scss">
.register {
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

  &__agreement {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: #4b5563;
    font-size: 13px;
    line-height: 1.4;
    cursor: pointer;

    input {
      margin-top: 2px;
      accent-color: #ff477e;
    }
  }

  &__error {
    margin: -10px 0 0;
    color: #ef4444;
    font-size: 12px;
  }

  &__login {
    margin: 0;
    color: #8a94a6;
    font-size: 14px;
    text-align: center;
  }

  &__login-link {
    color: #ff477e;
    font-weight: 700;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>