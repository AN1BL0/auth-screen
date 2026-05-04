<script setup lang="ts">
interface Props {
  id: string
  label: string
  modelValue: string
  type?: string
  placeholder?: string
  error?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  error: '',
})
/* задаём значение пропсов по умолчанию */

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement

  emit('update:modelValue', target.value)
}
/* передаём в LoginPage инпут из поля */
</script>

<template>
  <div class="field">
    <div class="field__top">
      <label
          class="field__label"
          :for="id"
      >
        {{ label }}
      </label>

      <slot name="action" />
    </div>

    <div
        class="field__control"
        :class="{ 'field__control--invalid': error }"
    >
      <input
          class="field__input"
          :id="id"
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          @input="handleInput"
      />

      <slot name="suffix" />
    </div>

    <p
        v-if="error"
        class="field__error"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.field {
  display: grid;
  gap: 8px;

  &__top {
    min-height: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__label {
    font-size: 13px;
    font-weight: 700;
  }

  &__control {
    min-height: 48px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-inline: 14px;
    border: 1px solid #d9dee8;
    border-radius: 12px;
    background-color: #ffffff;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;

    &:focus-within {
      border-color: #ff477e;
      box-shadow: 0 0 0 4px rgba(255, 71, 126, 0.12);
    }

    &--invalid {
      border-color: #ef4444;
    }
  }

  &__input {
    width: 100%;
    border: 0;
    outline: 0;
    background-color: transparent;
    color: #111827;
    font: inherit;
    font-size: 14px;

    &::placeholder {
      color: #8a94a6;
    }
  }

  &__error {
    margin: 0;
    color: #ef4444;
    font-size: 12px;
  }
}
</style>