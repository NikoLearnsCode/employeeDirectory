<template>
  <div class="employee-card">
    <!-- Bild -->
    <img
      :src="user.image"
      :alt="`${user.firstName} ${user.lastName}`"
      class="employee-image"
      loading="lazy"
      @error="handleImageError"
    />

    <!-- Namn -->
    <h3 class="employee-name">{{ user.firstName }} {{ user.lastName }}</h3>

    <!-- Avdelning + Roll -->
    <div v-if="user.company" class="company-info">
      <div class="department">{{ user.company.department }}</div>
      <div class="title">{{ user.company.title }}</div>
    </div>

    <!-- Mail -->
    <a
      :href="`mailto:${user.email}`"
      class="employee-email"
      :title="`Kontakta ${user.firstName} ${user.lastName}`"
    >
      <Mail :size="20" :stroke-width="1" />
      Kontakt
    </a>
  </div>
</template>

<script setup>
import {Mail} from 'lucide-vue-next';

defineProps({
  user: {
    type: Object,
    required: true,
  },
});

// Fallback
const handleImageError = (event) => {
  event.target.src =
    'https://placehold.co/80x80/e5e7eb/9ca3af?text=Bild%20saknas';
};
</script>

<style lang="scss" scoped>
.employee-card {
  @include card;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  gap: $spacing-sm;
  transition: $transition-slow;
  border: 1px solid $border-color;

  @media (min-width: 769px) {
    padding: $spacing-xl;
  }

  @media (min-width: 1025px) {
    padding: $spacing-lg;
  }

  // Bild
  .employee-image {
    width: 80px;
    height: 80px;
    border-radius: $radius-full;
    object-fit: cover;
    box-shadow: $shadow-sm;
    object-position: center;
    border: 2px solid $border-color;

    margin-bottom: $spacing-sm;

    @media (min-width: 1025px) {
      width: 90px;
      height: 90px;
    }
  }

  // Namn
  .employee-name {
    margin: 0 0 $spacing-sm 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: $text-color;

    @media (min-width: 481px) {
      font-size: 1.125rem;
    }

    @media (min-width: 769px) {
      font-size: 1.125rem;
    }

    @media (min-width: 1025px) {
      font-size: 1.25rem;
    }
  }

  // Avdelning + Roll
  .company-info {
    margin-bottom: $spacing-lg;

    .department {
      font-size: 1rem;
      font-weight: 500;
      color: $text-color;
      margin-bottom: $spacing-xs;

      @media (min-width: 481px) {
        font-size: 0.9rem;
      }

      @media (min-width: 1025px) {
        font-size: 1rem;
      }
    }

    .title {
      font-size: 0.9rem;
      color: $gray-500;

      @media (min-width: 481px) {
        font-size: 0.8rem;
      }

      @media (min-width: 1025px) {
        font-size: 0.9rem;
      }
    }
  }

  // Mail
  .employee-email {
    @include button-primary;
    width: 100%;
    gap: $spacing-sm;
  }
}
</style>
