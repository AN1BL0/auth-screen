<script setup lang="ts">
type ButtonType = 'button' | 'submit' | 'reset'
type ButtonVariant = 'primary' | 'secondary'
/* т.к. кнопки на экране авторизации две - одна из них главная ('log in'), а другая - второстепенная ('via google и т.д.') */

interface Props {
  type?: ButtonType
  variant?: ButtonVariant
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
})
/* задаём значение пропсов по умолчанию */
</script>

<template>
  <button
      class="button"
      :class="`button--${variant}`"
      :type="type"
      :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.button {
  min-height: 48px;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-inline: 20px;
  border: 1px solid transparent;
  border-radius: 12px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
      opacity 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--primary {
    color: #ffffff;
    background: linear-gradient(90deg, #ff8a8a, #ff477e);
    box-shadow: 0 14px 28px rgba(255, 71, 126, 0.28);
  }

  &--secondary {
    color: #111827;
    background-color: #ffffff;
    border-color: #d9dee8;

    &:hover:not(:disabled) {
      background-color: #f7f8fb;
    }
  }
}
</style>