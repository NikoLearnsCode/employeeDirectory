<template>
  <div class="employee-search">
    <div class="search-container" :class="{'is-expanded': isExpanded}">
      <Search :size="iconSize" class="search-icon" :stroke-width="1.25" />
      <!-- Sökfält -->
      <input
        :title="`Klicka för att söka`"
        ref="searchInput"
        id="search"
        type="text"
        v-model="localValue"
        @input="handleInput"
        @click="expandSearch"
        @focus="expandSearch"
        @blur="handleBlur"
        autocomplete="off"
        :placeholder="placeholder"
        class="search-input"
        :class="searchStatusClass"
        :maxlength="maxLength"
      />
      <!-- Rensa knapp -->
      <button
        v-if="isExpanded"
        type="button"
        class="clear-button"
        @click.stop="
          localValue = '';
          emit('update:modelValue', '');
          isExpanded = false;
        "
        :title="`Rensa sökfältet`"
      >
        <X :size="20" :stroke-width="1.5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, computed} from 'vue';
import {Search, X} from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  hasResults: {
    type: Boolean,
    default: false,
  },
  resultsCount: {
    type: Number,
    default: 0,
  },
  isSearching: {
    type: Boolean,
    default: false,
  },
  maxLength: {
    type: Number,
    default: 50,
  },
});

const emit = defineEmits(['update:modelValue']);

// Local reactive value för snabbare UI uppdatering
const localValue = ref(props.modelValue);
const isTyping = ref(false);
const isExpanded = ref(false);

// Template ref för sökfältet
const searchInput = ref(null);

// Debounce timer för att förhindra spam uppdateringar
let debounceTimer = null;

const placeholder = computed(() => {
  return isExpanded.value ? 'Sök efter namn eller e-post' : 'Sök';
});

const iconSize = computed(() => {
  return isExpanded.value ? 20 : 22;
});

// Compute search status class för att visa status
const searchStatusClass = computed(() => {
  // Om användaren håller på att skriva, visa ingen status
  if (isTyping.value || props.isSearching) {
    return '';
  }

  // Om det finns söktext och sökresultat
  if (props.modelValue && props.resultsCount > 0) {
    return 'has-results';
  }

  // Om det finns söktext men inga resultat
  if (props.modelValue && props.resultsCount === 0) {
    return 'no-results';
  }

  return '';
});

const expandSearch = () => {
  isExpanded.value = true;
};

// Kollapsa när man klickar utanför och det inte finns text
const handleBlur = () => {
  setTimeout(() => {
    if (!localValue.value.trim()) {
      isExpanded.value = false;
    }
  }, 150);
};

// Hantera input med debouncing
const handleInput = () => {
  isTyping.value = true;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    isTyping.value = false;
    emit('update:modelValue', localValue.value);
  }, 500);
};

// Kontrollera om det finns externa ändringar i modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
    // Kollapsa sökfältet om värdet nollställs utifrån och användaren inte har focus
    if (!newValue.trim() && document.activeElement !== searchInput.value) {
      isExpanded.value = false;
    }
  }
);
</script>

<style lang="scss" scoped>
.employee-search {
  width: 100%;

  @media (min-width: 541px) {
    width: fit-content;
  }
}

.clear-button {
  @include button-base;
  position: absolute;
  padding: 7px 5px;
  right: $spacing-md;
  color: $text-muted;
  z-index: 10;
  right: 7px;

  background-color: transparent;
  border: none;
  cursor: pointer;

  animation: spinX 0.4s ease-in-out;
  transform-origin: center;

  &:hover {
    color: $error-color;
  }
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;

  transition: all $transition-slow;
  width: 100px;

  &.is-expanded {
    width: 100%;
  }
}

.search-icon {
  position: absolute;
  left: $spacing-md;
  color: $text-color;
  pointer-events: none;

  transition: all $transition-slow;
}

.search-input {
  width: 100%;
  padding: $spacing-sm $spacing-lg $spacing-sm 2.4rem;
  background-color: $background-color;
  border-radius: $radius-lg;
  font-size: 1.1rem;
  color: $text-color;
  transition: all $transition-slow;
  cursor: pointer;
  border: 1px solid transparent;
  outline: 2px solid transparent;

  &::placeholder {
    color: $text-color;
    transition: font-size $transition-slow;
  }

  .search-container.is-expanded & {
    cursor: text;
    padding-right: 2.4rem;

    &::placeholder {
      font-size: 0.9rem;
      color: $text-muted;
    }

    border: 1px solid $border-color;
    outline: 2px solid $border-color;

    &:focus {
      outline: 2px solid $focus-color;
    }

    &.has-results {
      @include status-success;

      &:focus {
        outline: 2px solid $success-color;
      }
    }

    &.no-results {
      @include status-error;

      &:focus {
        outline: 2px solid $error-color;
      }
    }
  }
}

@media (min-width: 541px) {
  .search-container {
    &.is-expanded {
      width: 370px;
    }
  }
}
</style>
