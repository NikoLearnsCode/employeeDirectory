<template>
  <main class="employee-directory">
    <!-- Loading -->
    <Loading v-if="isLoading && !userFriendlyError" />

    <!-- Mega-error -->
    <ErrorMessage
      v-else-if="userFriendlyError"
      :message="userFriendlyError"
      @retry="fetchEmployees"
    />

    <!-- Innehåll -->
    <div v-else class="employee-directory-content">
      <!-- Filter -->
      <div class="controls">
        <Filters
          v-model="selectedFilters"
          :departments="availableDepartments"
          :titles="availableTitles"
        />
      </div>

      <!-- Aktiva filter -->
      <ActiveFilters
        :displayed-count="displayedCount"
        :results-count="filteredEmployees.length"
      />

      <!-- Grid -->
      <EmployeeGrid :users="paginatedEmployees" />

      <Pagination
        v-if="filteredEmployees.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />

      <!-- Scroll till toppen button -->
      <button
        v-if="paginatedEmployees.length > 3"
        @click="scrollToTop('smooth')"
        class="scroll-to-top-btn"
        title="Scrolla till toppen"
      >
        <ChevronUp :size="20" />
      </button>
    </div>
  </main>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import Loading from '@/components/employees/Loading.vue';
import EmployeeGrid from '@/components/employees/Grid.vue';
import ErrorMessage from '@/components/shared/ErrorMessage.vue';
import Pagination from '@/components/employees/Pagination.vue';
import Filters from '@/components/employees/Filters.vue';
import ActiveFilters from '@/components/employees/ActiveFilters.vue';
import {ChevronUp} from 'lucide-vue-next';

// States
const allEmployees = ref([]);
const isLoading = ref(false);
const userFriendlyError = ref(null);
const currentPage = ref(1);
const selectedFilters = ref({
  department: '',
  title: '',
});

// Constants
const PEOPLE_PER_PAGE = 10;

// Fetch employees
const fetchEmployees = async () => {
  isLoading.value = true;
  userFriendlyError.value = null;

  try {
    const response = await fetch(
      'https://dummyjson.com/users?limit=0&select=id,firstName,lastName,email,image,company&order=asc'
    );
    if (!response.ok) {
      throw response;
    }
    const data = await response.json();
    allEmployees.value = data.users;
  } catch (error) {
    console.error('Fel vid hämtning av anställda:', error);
    // HTTP-error
    if (error.status) {
      if (error.status === 404) {
        userFriendlyError.value =
          'Kunde inte hitta resursen (Fel 404). Kontrollera att webbadressen är korrekt.';
      }
      // Server error
      else {
        userFriendlyError.value = `Ett oväntat serverfel uppstod (Status: ${error.status}). Försök igen senare.`;
      }
    }
    // Network error
    else {
      userFriendlyError.value =
        'Ett nätverksfel uppstod. Kontrollera din internetanslutning och försök igen.';
    }
  } finally {
    isLoading.value = false;
  }
};

// ============ HJÄLPFUNKTIONER ============
// Central filter-funktion - filtrerar baserat på aktiva filter
const applyFilters = (employees, options) => {
  let filtered = employees;

  // Avdelning filter - om avdelning-filter är aktivt och en avdelning är vald
  if (options.includeDepartment && selectedFilters.value.department) {
    filtered = filtered.filter(
      (user) => user.company?.department === selectedFilters.value.department
    );
  }

  // Roll filter - om roll-filter är aktivt och en roll är vald
  if (options.includeTitle && selectedFilters.value.title) {
    filtered = filtered.filter(
      (user) => user.company?.title === selectedFilters.value.title
    );
  }

  return filtered;
};

// Funktion för att extrahera unika värden från employees
const extractUniqueValues = (employees, field, currentValue = '') => {
  const values = new Set();

  if (currentValue) {
    values.add(currentValue);
  }

  employees.forEach((employee) => {
    const value = employee.company?.[field];
    if (value) {
      values.add(value);
    }
  });

  return Array.from(values);
};

// ============ BERÄKNINGAR ============
// Filtered employees - vad som visas i grid
const filteredEmployees = computed(() => {
  return applyFilters(allEmployees.value, {
    includeDepartment: true,
    includeTitle: true,
  });
});

// Tillgängliga avdelningar - vad som visas i avdelning-dropdown
const availableDepartments = computed(() => {
  const relevantUsers = applyFilters(allEmployees.value, {
    includeDepartment: false,
    includeTitle: true,
  });

  return extractUniqueValues(
    relevantUsers,
    'department',
    selectedFilters.value.department
  );
});

// Tillgängliga roller - vad som visas i roll-dropdown
const availableTitles = computed(() => {
  const relevantUsers = applyFilters(allEmployees.value, {
    includeDepartment: true,
    includeTitle: false,
  });

  return extractUniqueValues(
    relevantUsers,
    'title',
    selectedFilters.value.title
  );
});

// =========== PAGINATION ===========
// Beräkna totala sidor
const totalPages = computed(() => {
  return Math.ceil(filteredEmployees.value.length / PEOPLE_PER_PAGE);
});

// Sida för sida
const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * PEOPLE_PER_PAGE;
  const end = start + PEOPLE_PER_PAGE;
  return filteredEmployees.value.slice(start, end);
});

// Sidbyte
const handlePageChange = (page) => {
  currentPage.value = page;
  if (window.scrollY > 50) {
    scrollToTop('instant');
  }
};

const scrollToTop = (behavior = 'smooth' | 'instant') => {
  window.scrollTo({top: 0, behavior});
};

// Visat antal
const displayedCount = computed(() => {
  const totalResults = filteredEmployees.value.length;
  if (totalResults === 0) {
    return 0;
  }
  const start = (currentPage.value - 1) * PEOPLE_PER_PAGE + 1;
  const end = Math.min(start + PEOPLE_PER_PAGE - 1, totalResults);
  return `${start}-${end}`;
});

// Hämta fölket
onMounted(() => {
  fetchEmployees();
});
</script>

<style lang="scss" scoped>
.employee-directory {
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: $spacing-2xl 0 $spacing-4xl;
  @media (min-width: 541px) {
    padding: $spacing-3xl $spacing-lg $spacing-5xl;
  }

  .directory-title {
    text-align: center;
    color: $text-color;
    font-weight: 700;
    font-style: italic;
    font-size: 1.7rem;
    margin-bottom: $spacing-lg;

    @media (min-width: 481px) {
      font-size: 2rem;
    }

    @media (min-width: 1101px) {
      margin-bottom: 0;
    }
  }

  .employee-directory-content {
    .controls {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: $spacing-lg;
      margin-bottom: $spacing-sm;

      @media (min-width: 1001px) {
        flex-direction: row;
        justify-content: flex-end;
        align-items: flex-end;
        margin-bottom: $spacing-lg;
      }
    }
  }
  .scroll-to-top-btn {
    @include button-base;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    margin: 2rem auto 0;
    border-radius: $radius-full;
    border: 1px solid $border-color;
    color: $text-muted;

    &:hover {
      transform: translateY(-3px);
    }

    &:active {
      transform: translateY(-3px);
    }

    &:focus-visible {
      border-radius: $radius-full;
    }

    @media (min-width: 1201px) {
      display: none;
    }
  }
}
</style>
