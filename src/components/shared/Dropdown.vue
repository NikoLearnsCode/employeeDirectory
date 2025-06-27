<template>
  <div
    class="custom-dropdown"
    :class="customClass"
    ref="dropdownRef"
    @click="handleContainerClick"
  >
    <!-- Trigger Button -->
    <button
      type="button"
      class="dropdown-trigger"
      :class="{'is-open': isOpen, 'is-disabled': disabled}"
      @click.stop="toggleDropdown"
      @keydown="handleTriggerKeydown"
      :disabled="disabled"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
    >
      <span class="dropdown-text">
        {{ customLabel || selectedLabel || placeholder }}
      </span>
      <ChevronDown
        v-if="!hideChevron"
        :size="20"
        :stroke-width="1.5"
        class="dropdown-arrow"
        :class="{'is-rotated': isOpen}"
      />
    </button>

    <!-- Custom Dropdown Menu -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="dropdown-menu"
        role="listbox"
        :aria-label="placeholder"
        @click.stop
      >
        <div class="dropdown-options">
          <!-- Clear/All option (endast för filter-dropdowns) -->
          <div
            v-if="!hideFirstOption"
            class="dropdown-option"
            :class="{'is-selected': !value}"
            @click="selectOption('')"
            @keydown="handleOptionKeydown($event, '')"
            tabindex="0"
            role="option"
            :aria-selected="!value"
          >
            {{ placeholder }}
          </div>

          <!-- Standard options -->
          <div
            v-for="option in options"
            :key="option.value"
            class="dropdown-option"
            :class="{'is-selected': value === option.value}"
            @click="selectOption(option.value)"
            @keydown="handleOptionKeydown($event, option.value)"
            tabindex="0"
            role="option"
            :aria-selected="value === option.value"
          >
            {{ option.label }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {ChevronDown} from 'lucide-vue-next';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Välj...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  customLabel: {
    type: String,
    default: '',
  },
  hideFirstOption: {
    type: Boolean,
    default: false,
  },
  hideChevron: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:value']);

const dropdownRef = ref(null);
const isOpen = ref(false);

const selectedLabel = computed(() => {
  const selected = props.options.find((option) => option.value === props.value);
  return selected ? selected.label : null;
});

const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
};

const selectOption = (value) => {
  emit('update:value', value);
  isOpen.value = false;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleContainerClick = () => {
  if (isOpen.value) {
    closeDropdown();
  }
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
};

const handleFocusOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
};

const handleEscape = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeDropdown();
  }
};

// Keyboard navigation för trigger-buttons
const handleTriggerKeydown = (event) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
    case 'ArrowDown':
    case 'ArrowUp':
      event.preventDefault();
      if (!isOpen.value) {
        toggleDropdown();
      }
      break;
    case 'Escape':
      if (isOpen.value) {
        closeDropdown();
      }
      break;
  }
};

// Keyboard navigeringför dropdown-options
const handleOptionKeydown = (event, value) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      selectOption(value);
      break;
    case 'Escape':
      event.preventDefault();
      closeDropdown();
      break;
    case 'ArrowDown':
      event.preventDefault();
      focusNextOption(event.target);
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusPreviousOption(event.target);
      break;
  }
};

// Fokus hjälpfunktioner
const focusNextOption = (currentElement) => {
  const options = Array.from(
    dropdownRef.value.querySelectorAll('.dropdown-option')
  );
  const currentIndex = options.indexOf(currentElement);
  const nextIndex = (currentIndex + 1) % options.length;
  options[nextIndex].focus();
};

const focusPreviousOption = (currentElement) => {
  const options = Array.from(
    dropdownRef.value.querySelectorAll('.dropdown-option')
  );
  const currentIndex = options.indexOf(currentElement);
  const previousIndex =
    currentIndex === 0 ? options.length - 1 : currentIndex - 1;
  options[previousIndex].focus();
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('focusin', handleFocusOutside);
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('focusin', handleFocusOutside);
  document.removeEventListener('keydown', handleEscape);
});
</script>

<style lang="scss" scoped>
// Base Container
.custom-dropdown {
  position: relative;
  width: 100%;
}

// Trigger button
.dropdown-trigger {
  display: flex;
  align-items: center;
  width: 100%;
  padding: $spacing-sm $spacing-lg;

  border: none !important;
  border-radius: $radius-md;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;

  outline: none !important;
  box-shadow: none !important;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  transition: background-color $transition-normal;

  &:focus-visible {
    outline: 2px solid $focus-color !important;
  }
}

// Trigger button content
.dropdown-text {
  flex: 1;
  color: $text-color;

  .is-disabled & {
    color: $gray-400;
  }
}

.dropdown-arrow {
  flex-shrink: 0;
  margin: 0 $spacing-sm;
  color: $text-muted;
  transition: transform $transition-normal;

  &.is-rotated {
    transform: rotate(180deg);
  }

  .is-disabled & {
    color: $gray-300;
  }
}

// Dropdown menu
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  min-width: 150px;
  margin-top: $spacing-xs;
  max-width: 350px;
  @include card;
  box-shadow: $shadow-lg;
  overflow: hidden;

  @media (min-width: 768px) {
    max-width: none;
  }
}

.dropdown-options {
  width: 100%;
  overflow-y: auto;

  max-height: 250px;

  @media (min-width: 768px) {
    max-height: 350px;
  }
}

// Dropdown options
.dropdown-option {
  padding: $spacing-md $spacing-lg;
  font-size: 0.9rem;
  color: $text-color;
  cursor: pointer;
  transition: background-color $transition-fast;

  &:hover,
  &:focus {
    outline: none;
    background-color: $gray-100;
  }

  &.is-selected {
    background-color: $gray-100;
    font-weight: 800;
  }
}

// Animations
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all $transition-fast;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-$spacing-sm) scale(0.95);
}

// DropUP variants för Pagination
.page-dropdown {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: fit-content;

  // DropUP istället för dropdown
  .dropdown-menu {
    top: auto;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    min-width: 100px;
    max-width: 150px;
    margin-top: 0;
    margin-bottom: $spacing-xs;
  }
}
</style>
