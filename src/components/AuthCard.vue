<template>
<!-- Подложка для окна авторизации, так назвываемая Card -->
  <main class="auth">
    <section class="auth__card">
      <slot />
    </section>
  </main>
</template>

<style scoped lang="scss">
.auth {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  background:
      radial-gradient(circle at top left, rgba(255, 138, 138, 0.18), transparent 32%),
      linear-gradient(135deg, #f3f6fb 0%, #eef2f8 100%);

  &__card {
    width: min(100%, 420px);
    padding: 40px;
    border-radius: 28px;
    background-color: #ffffff;
    box-shadow: 0 24px 80px rgba(17, 24, 39, 0.12);
  }
}

@media (max-width: 480px) {
  .auth {
    padding: 16px;

    &__card {
      padding: 28px 20px;
      border-radius: 22px;
    }
  }
}
</style>