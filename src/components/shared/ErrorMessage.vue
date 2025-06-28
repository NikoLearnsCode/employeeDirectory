<template>
  <div class="error-message">
    <div class="error-icon">
      <Frown :size="72" :stroke-width="0.5" />
    </div>
    <p class="error-description">{{ message }}</p>
    <button @click="$emit('retry')" class="retry-btn">Försök igen</button>
  </div>
</template>

<script setup>
import {Frown} from 'lucide-vue-next';

defineProps({
  message: {
    type: String,
    default: 'Ett oväntat fel uppstod',
  },
});
defineEmits(['retry']);
</script>

<style lang="scss" scoped>
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: $spacing-xl $spacing-xl;
  text-align: center;


  .error-icon {
    margin-bottom: $spacing-2xl;
    display: flex;
    justify-content: center;
  }

  .error-description {
    font-size: 1rem;
    margin: 0 0 $spacing-2xl 0;
    font-weight: 500;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.5;

    
  }

  .retry-btn {

    @include button-primary;

  }
}
</style>
