<template>
  <div class="employee-card">
    <!-- Image -->
    <img
      :src="user.image"
      :alt="`${user.firstName} ${user.lastName}`"
      class="employee-image"
      @error="handleImageError"
    />

    <!-- Name -->
    <h3 class="employee-name">{{ user.firstName }} {{ user.lastName }}</h3>

    <!-- Department + Title -->
    <div v-if="user.company" class="company-info">
      <div class="department">{{ user.company.department }}</div>
      <div class="title">{{ user.company.title }}</div>
    </div>

    <!-- Email -->
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
  align-items: center;
  text-align: center;
  gap: $spacing-sm;
  transition: $transition-slow;
  border: 1px solid $gray-200;

  @media (min-width: 481px) {
    // padding: $spacing-lg;
  }

  @media (min-width: 769px) {
    padding: $spacing-xl;
  }

  @media (min-width: 1025px) {
    padding: $spacing-lg;
  }

  // Image
  .employee-image {
    width: 60px;
    height: 60px;
    border-radius: $radius-full;
    object-fit: cover;
    object-position: center;
    border: 2px solid $gray-200;
    margin-bottom: $spacing-sm;

    @media (min-width: 481px) {
      width: 80px;
      height: 80px;
    }

    @media (min-width: 769px) {
      width: 70px;
      height: 70px;
    }

    @media (min-width: 1025px) {
      width: 90px;
      height: 90px;
    }
  }

  // Name
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

  // Department + Title
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

  // Email
  .employee-email {
    @include button-secondary;
    color: $gray-800;
    text-decoration: none;
    width: 100%;
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
  }
}
</style>
