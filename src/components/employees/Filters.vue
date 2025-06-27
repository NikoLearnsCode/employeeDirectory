<template>
  <div class="employee-filters">
    <!-- Avdelning Filter -->
    <div class="filter-group">
      <span class="sr-only">Alla avdelningar</span>
      <Dropdown
        :value="modelValue.department"
        :options="departmentOptions"
        placeholder="Alla avdelningar"
        :title="`Filtrera efter avdelning`"
        @update:value="updateFilters('department', $event)"
        :disabled="departments.length === 0"
      />
    </div>

    <!-- Roll Filter -->
    <div class="filter-group">
      <span class="sr-only">Alla roller</span>
      <Dropdown
        :value="modelValue.title"
        :options="titleOptions"
        placeholder="Alla roller"
        :title="`Filtrera efter roll`"
        @update:value="updateFilters('title', $event)"
        :disabled="titles.length === 0"
      />
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import Dropdown from '@/components/shared/Dropdown.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({department: '', title: ''}),
  },
  departments: {
    type: Array,
    default: () => [],
  },
  titles: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const updateFilters = (key, value) => {
  const newFilters = {...props.modelValue, [key]: value};
  emit('update:modelValue', newFilters);
};

// Gör om arrayer till options-format för dropdown
const departmentOptions = computed(() => {
  return props.departments.map((dept) => ({
    value: dept,
    label: dept,
  }));
});

const titleOptions = computed(() => {
  return props.titles.map((title) => ({
    value: title,
    label: title,
  }));
});
</script>

<style lang="scss" scoped>
.employee-filters {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: $spacing-md;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: $spacing-sm;
    align-items: flex-end;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}
</style>
