<template>
  <div v-if="totalPages > 1" class="pagination-bar">
    <!-- Prev button -->
    <button
      @click="goToPreviousPage"
      :disabled="currentPage === 1"
      class="nav-btn"
      :class="{disabled: currentPage === 1}"
      :title="currentPage === 1 ? 'Första sidan' : 'Föregående sida'"
    >
      <ChevronLeft :size="22" />
    </button>

    <!-- Drop-UP för sidor -->
    <Dropdown
      custom-class="page-dropdown"
      :value="currentPage.toString()"
      :options="pageOptions"
      :custom-label="`${currentPage} / ${totalPages}`"
      :hide-first-option="true"
      :hide-chevron="true"
      @update:value="goToPage"
    />

    <!-- Next button -->
    <button
      @click="goToNextPage"
      :disabled="currentPage === totalPages"
      class="nav-btn"
      :class="{disabled: currentPage === totalPages}"
      :title="currentPage === totalPages ? 'Sista sidan' : 'Nästa sida'"
    >
      <ChevronRight :size="22" />
    </button>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {ChevronLeft, ChevronRight} from 'lucide-vue-next';
import Dropdown from '@/components/shared/Dropdown.vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['page-change']);

// Gör om arrayer till options-format för dropdown
const pageOptions = computed(() => {
  const options = [];
  for (let i = 1; i <= props.totalPages; i++) {
    options.push({
      value: i.toString(),
      label: `${i}`,
    });
  }
  return options;
});

const goToPreviousPage = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1);
  }
};

const goToNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1);
  }
};

const goToPage = (pageString) => {
  const page = parseInt(pageString);
  // Kontrollerar om sidan är en siffra och inte samma som nuvarande sida
  if (page && page !== props.currentPage) {
    emit('page-change', page);
  }
};
</script>

<style lang="scss" scoped>
.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: $spacing-3xl;
  padding: $spacing-sm 0;

  gap: $spacing-sm;

  @media (min-width: 481px) {
    gap: $spacing-md;
  }

  @media (min-width: 769px) {
    gap: $spacing-xs;
  }
  // Prev/Next buttons
  .nav-btn {
    @include button-base;
    padding: $spacing-sm;
    color: $gray-500;

    min-width: 2.25rem;
    height: 2.25rem;


    &:hover:not(.disabled) {
      color: $gray-900;
    }

    &.disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
}
</style>
