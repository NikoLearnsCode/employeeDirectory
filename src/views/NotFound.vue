<template>
  <div class="not-found">
    <div class="not-found-content">
      <h2 class="not-found-title">GRATTIS!</h2>

      <p class="not-found-description">
        Du har hittat en sida som inte finns (ännu)
      </p>

      <div class="not-found-actions">
        <router-link to="/" class="back-home-btn">
          Gå tillbaka
          <ArrowRight class="arrow-icon" :size="18" :stroke-width="1.5" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ArrowRight} from 'lucide-vue-next';
</script>

<style lang="scss" scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl;

  .not-found-content {
    text-align: center;
    max-width: 500px;

    .not-found-title {
      font-size: 4rem;
      font-weight: 800;
      color: $text-color;
      margin: 0 0 $spacing-sm 0;
      line-height: 1;

      @media (max-width: 640px) {
        font-size: 3rem;
      }
    }

    .not-found-subtitle {
      font-size: 2rem;
      font-weight: 600;
      color: #4b5563;
      margin: 0 0 $spacing-sm 0;

      @media (max-width: 640px) {
        font-size: 1.5rem;
      }
    }

    .not-found-description {
      font-size: 1.1rem;
      color: #6b7280;
      margin: 0 0 $spacing-2xl 0;
      line-height: 1.6;
    }

    .not-found-actions {
      .back-home-btn {
        @include button-base;
        font-size: 1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        color: $gray-500;
        font-style: italic;
        padding: $spacing-sm $spacing-md;
        transition: all $transition-normal;
        .arrow-icon {
          margin-left: $spacing-sm;
          transition: all $transition-normal;
        }

        &:hover {
          color: $text-color;
          .arrow-icon {
            transform: translateX(5px);
          }
        }
      }
    }
  }
}
</style>
