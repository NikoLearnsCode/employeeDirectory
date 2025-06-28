<template>
  <div class="loading-spinner">
    <div class="spinner">
      <Loader2 :size="48" :stroke-width="1.25" />
    </div>
    <p class="loading-text">Hämtar anställda...</p>
  </div>
</template>

<script setup>
import {Loader2} from 'lucide-vue-next';
</script>

<style lang="scss" scoped>
.loading-spinner {
  display: flex;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .spinner {
    margin-bottom: $spacing-lg;
    display: flex;
    color: $text-muted;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    color: $text-muted;
    font-size: 1rem;
    margin: 0;
    font-weight: 500;
    font-style: italic;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
