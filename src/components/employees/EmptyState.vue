<template>
  <div class="empty-state">
    <div class="empty-icon">
      <Users :size="64" :stroke-width="1" />
    </div>
    <h3 class="empty-title">Inga anställda hittades</h3>
    <p class="empty-description">
      Testa att ändra dina sökkriterier eller
      <button @click="$emit('clear-filters')" class="clear-filters-btn">
        rensa filtren
      </button>
      för att se fler resultat.
    </p>
  </div>
</template>

<script setup>
import {Users} from 'lucide-vue-next';

defineEmits(['clear-filters']);
</script>

<style lang="scss" scoped>
.empty-state {
  text-align: center;
  padding: $spacing-5xl $spacing-3xl;
  color: $text-muted;

  .empty-icon {
    margin-bottom: $spacing-2xl;
    display: flex;
    justify-content: center;

    svg {
      color: $gray-400;
    }
  }

  .empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 $spacing-sm 0;
    color: $text-muted;
  }

  .empty-description {
    font-size: 1rem;
    margin: 0;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.5;

    .clear-filters-btn {
      @include button-base;
      text-decoration: underline;
      text-underline-offset: 2px;
      font-size: 1rem;
      color: $gray-900;
      transition: all $transition-normal;
      font-weight: 500;


      &:hover {
        color: $gray-600;
        text-decoration-color: $gray-400;
      }

     
    }
  }
}
</style>
