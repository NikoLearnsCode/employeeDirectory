<template>
  <div class="active-filters-bar">
    <div class="results-info">
      Visar {{ displayedCount }} av {{ resultsCount }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  displayedCount: {
    type: [String, Number],
    required: true,
  },
  resultsCount: {
    type: Number,
    required: true,
  },
});
</script>
<style lang="scss" scoped>
.active-filters-bar {
  display: flex;

  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
  padding: 0 $spacing-lg $spacing-lg;
  gap: $spacing-sm;
  flex-wrap: wrap;

  @media (min-width: 1001px) {
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    margin-bottom: $spacing-lg;
  }
  .results-info {
    color: $text-muted;
    font-size: 0.9rem;
    padding: 0.6rem 0;
  }
}
</style>
