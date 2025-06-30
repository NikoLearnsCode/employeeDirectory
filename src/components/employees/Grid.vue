<template>
  <div class="employee-grid">
    <EmployeeCard v-for="user in users" :key="user.id" :user="user" />
  </div>
</template>

<script setup>
import EmployeeCard from './Card.vue';

defineProps({
  users: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.employee-grid {
  display: grid;
  grid-template-columns: 1fr;
   row-gap: $spacing-4xl;
  padding-top: $spacing-xl;
  margin-bottom: $spacing-3xl;
  
  

  @media (min-width: 481px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

  }

  @media (min-width: 641px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 901px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (min-width: 1201px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));

    
  }
}
</style>
