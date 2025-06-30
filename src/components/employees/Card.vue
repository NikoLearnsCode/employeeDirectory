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

    <!-- Titel + Avdelning -->
    <div v-if="user.company" class="company-info">
      <div class="title">{{ user.company.title }}</div>
      <div class="department">{{ user.company.department }}</div>
    </div>

    <!-- Kontakt ikoner -->
    <div class="contact-icons">
      <!-- Mail -->
      <a
        :href="`mailto:${user.email}`"
        class="contact-icon"
        :title="`Skicka mail till ${user.firstName} ${user.lastName}`"
      >
        <Mail :size="22" :stroke-width="1.5" />
      </a>

      <!-- Telefon -->
      <a
        :href="`tel:${user.phone}`"
        class="contact-icon"
        :title="`Ring ${user.firstName} ${user.lastName} (${user.phone})`"
      >
        <Phone :size="22" :stroke-width="1.5" />
      </a>
    </div>
  </div>
</template>

<script setup>
import {Mail, Phone} from 'lucide-vue-next';

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
  padding: 0 $spacing-md;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  gap: $spacing-xs;

  border-radius: $radius-lg;

  // Bild
  .employee-image {
    width: 130px;
    height: 130px;
    border-radius: $radius-full;
    object-fit: cover;
    border: 2px solid $gray-200;
    object-position: center;
    transition: border-color $transition-normal;
  }

  // Namn
  .employee-name {
    font-size: 1.2rem;
    font-weight: 700;
    color: $text-color;
  }

  // Titel + Avdelning
  .company-info {
    .title {
      font-size: 0.9rem;
      font-weight: 600;
      color: $text-color;
    }

    .department {
      font-size: 0.9rem;
      color: $gray-500;
      font-weight: 500;
    }
  }

  // Kontakt ikoner
  .contact-icons {
    display: flex;
    align-items: center;
    gap: $spacing-xs;

    justify-content: center;
    padding-top: $spacing-sm;

    .contact-icon {
      padding: $spacing-xs $spacing-sm;
      color: $gray-500;
      transition: $transition-normal;

      &:hover {
        color: $gray-900;
        transform: scale(1.05);
      }
    }
  }
}
</style>
