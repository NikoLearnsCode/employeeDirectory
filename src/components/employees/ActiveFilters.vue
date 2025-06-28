<template>
  <div v-if="shouldShow" class="active-filters-bar">
    <div class="results-info">
      Visar {{ displayedCount }} av {{ resultsCount }}
    </div>

    <!-- Resultat filterchain: sök > avdelning > roll -->
    <div v-if="hasActiveFilters" class="filter-chain">
      <div class="chain-steps">
        <div v-if="searchTerm" class="chain-step">
          <div class="step-header">
            <span class="step-label">Sök:</span>
            <!-- Mobile X-->
            <button
              @click="$emit('remove-filter', 'search')"
              class="remove-btn"
              title="Ta bort sökning"
            >
              <X :size="17" />
            </button>
          </div>
          <!-- Sök -->
          <div class="step-value-row">
            <span class="step-value">"{{ searchTerm }}"</span>
            <span class="step-count">({{ searchResultCount }})</span>
          </div>
          <!-- Desktop X-->
          <button
            @click="$emit('remove-filter', 'search')"
            class="remove-btn-horizontal"
            title="Ta bort sökning"
          >
            <X :size="18" />
          </button>
        </div>

        <div
          v-if="searchTerm && (filters.department || filters.title)"
          class="chain-arrow"
        >
          <ChevronRight :size="20" />
        </div>

        <!-- Avdelning -->
        <div v-if="filters.department" class="chain-step">
          <div class="step-header">
            <span class="step-label">Avdelning:</span>
            <!-- Mobile X-->
            <button
              @click="$emit('remove-filter', 'department')"
              class="remove-btn"
              title="Ta bort avdelningsfilter"
            >
              <X :size="17" />
            </button>
          </div>
          <div class="step-value-row">
            <span class="step-value">{{ filters.department }}</span>
            <span class="step-count">({{ departmentResultCount }})</span>
          </div>
          <!-- Desktop X-->
          <button
            @click="$emit('remove-filter', 'department')"
            class="remove-btn-horizontal"
            title="Ta bort avdelningsfilter"
          >
            <X :size="18" />
          </button>
        </div>
        <div v-if="filters.department && filters.title" class="chain-arrow">
          <ChevronRight :size="20" />
        </div>

        <!-- Roll -->
        <div v-if="filters.title" class="chain-step">
          <div class="step-header">
            <span class="step-label">Roll:</span>
            <!-- Mobile X-->
            <button
              @click="$emit('remove-filter', 'title')"
              class="remove-btn"
              title="Ta bort rollfilter"
            >
              <X :size="17" />
            </button>
          </div>
          <div class="step-value-row">
            <span class="step-value">{{ filters.title }}</span>
            <span class="step-count">({{ titleResultCount }})</span>
          </div>
          <!-- Desktop X-->
          <button
            @click="$emit('remove-filter', 'title')"
            class="remove-btn-horizontal"
            title="Ta bort rollfilter"
          >
            <X :size="18" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {X, ChevronRight} from 'lucide-vue-next';

const props = defineProps({
  searchTerm: {
    type: String,
    default: '',
  },

  filters: {
    type: Object,
    default: () => ({department: '', title: ''}),
  },

  resultsCount: {
    type: Number,
    default: 0,
  },
  displayedCount: {
    type: [Number, String],
    default: 0,
  },

  searchResultCount: {
    type: Number,
    default: 0, // resultat efter sökning
  },
  departmentResultCount: {
    type: Number,
    default: 0, // resultat efter avdelning
  },
  titleResultCount: {
    type: Number,
    default: 0, // resultat efter titel
  },
});

defineEmits(['remove-filter']);

const hasActiveFilters = computed(() => {
  return props.searchTerm || props.filters.department || props.filters.title;
});

const shouldShow = computed(() => {
  return props.resultsCount > 0 || hasActiveFilters.value;
});
</script>

<style lang="scss" scoped>
.active-filters-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: $spacing-sm $spacing-lg $spacing-xs;
  gap: $spacing-sm;
  flex-wrap: wrap;
  margin-bottom: $spacing-lg;

  @media (min-width: 1001px) {
    flex-direction: row;
    padding: 0 $spacing-lg $spacing-lg;
    justify-content: space-between;
    align-items: center;
  }

  .results-info {
    color: $text-muted;
    font-size: 0.9rem;
    padding: $spacing-sm $spacing-xs;

    @media (min-width: 1001px) {
      padding: 0.6rem 0;
    }
  }
}

.filter-chain {
  .chain-steps {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    flex-wrap: wrap;
  }
}

.chain-step {
  display: flex;
  @include card;

  padding: $spacing-sm $spacing-md;
  transition: all $transition-normal;
  min-width: 130px;
  margin-bottom: $spacing-sm;
  flex-direction: column;

  @media (min-width: 1001px) {
    flex-direction: row;
    align-items: center;
    margin-bottom: 0;
    gap: $spacing-sm;
  }

  .step-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (min-width: 1001px) {
      justify-content: flex-start;

      .remove-btn {
        display: none;
      }
    }

    .step-label {
      color: $gray-600;
      font-weight: 500;

      font-size: 0.75rem;

      @media (min-width: 541px) {
        font-size: 0.8rem;
      }
    }
  }

  .step-value-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;

    @media (min-width: 541px) {
      font-size: 0.9rem;
    }

    @media (min-width: 1001px) {
      gap: $spacing-xs;
    }

    .step-value {
      color: $text-color;
      font-weight: 600;
      word-break: break-all;
      white-space: normal;
      overflow-wrap: break-word;
      text-align: left;
    }

    .step-count {
      color: $text-color;
      font-weight: 600;
      font-size: 0.8rem;
      margin-left: $spacing-sm;

      @media (min-width: 1001px) {
        margin-left: 1px;
      }
    }
  }

  .remove-btn {
    @include button-base;
    padding: 0;
    color: $text-muted;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: $error-color;
    }
  }

  .remove-btn-horizontal {
    @include button-base;
    padding: 0;
    color: $text-muted;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;

    &:hover {
      color: $error-color;
    }

    @media (min-width: 1001px) {
      display: flex;
    }
  }
}

.chain-arrow {
  color: $gray-400;
  display: flex;
  align-items: center;
}
</style>
