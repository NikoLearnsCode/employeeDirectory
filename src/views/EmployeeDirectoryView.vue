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
        <Search
          ref="employeeSearchRef"
          v-model="searchTerm"
          :results-count="filteredEmployees.length"
          :is-searching="isLoading"
        />
        <Filters
          v-model="selectedFilters"
          :departments="availableDepartments"
          :titles="availableTitles"
        />
      </div>

      <!-- Aktiva filter -->
      <ActiveFilters
        :search-term="searchTerm"
        :filters="selectedFilters"
        :results-count="filteredEmployees.length"
        :displayed-count="displayedCount"
        :search-result-count="searchOnlyResults"
        :department-result-count="departmentChainResults"
        :title-result-count="titleChainResults"
        @remove-filter="removeFilter"
      />
      <div class="results-section">
        <!-- Inga resultat -->
        <EmptyState
          v-if="filteredEmployees.length === 0"
          @clear-filters="clearAllFilters"
        />
        <!-- Grid -->
        <EmployeeGrid v-else :users="paginatedEmployees" />

        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />

        <!-- Scroll top om fler än 3 per sida -->
        <button
          v-if="paginatedEmployees.length > 3"
          @click="scrollToTop('smooth')"
          class="scroll-to-top-btn"
          title="Scrolla till toppen"
        >
          <ChevronUp :size="20" />
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import {ref, onMounted, computed, watch} from 'vue';
import Loading from '@/components/shared/Loading.vue';
import EmployeeGrid from '@/components/employees/Grid.vue';
import ErrorMessage from '@/components/shared/ErrorMessage.vue';
import Pagination from '@/components/employees/Pagination.vue';
import Filters from '@/components/employees/Filters.vue';
import ActiveFilters from '@/components/employees/ActiveFilters.vue';
import Search from '@/components/employees/Search.vue';
import EmptyState from '@/components/employees/EmptyState.vue';
import {ChevronUp} from 'lucide-vue-next';

// State
const allEmployees = ref([]);
const isLoading = ref(true);
const userFriendlyError = ref(null);
const currentPage = ref(1);
const selectedFilters = ref({
  department: '',
  title: '',
});
const searchTerm = ref('');

// Constants
const PEOPLE_PER_PAGE = 10;

// Datahämtning
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
    if (error.status) {
      userFriendlyError.value =
        error.status === 404
          ? 'Kunde inte hitta resursen (Fel 404). Kontrollera att webbadressen är korrekt.'
          : `Ett oväntat serverfel uppstod (Status: ${error.status}). Försök igen senare.`;
    } else {
      userFriendlyError.value =
        'Ett nätverksfel uppstod. Kontrollera din internetanslutning och försök igen.';
    }
  } finally {
    isLoading.value = false;
  }
};

/* =============== HJÄLPFUNKTIONER ====================== */
/*
 * Central filter-funktion. 
 Filtrerar baserat på de nuvarande aktiva filtren (sök, avdelning, titel)
 */
const applyFilters = (employees, options) => {
  let filtered = employees;

  // Sökfilter (om aktivt)
  if (options.includeSearch && searchTerm.value) {
    const search = searchTerm.value.toLowerCase().trim();
    filtered = filtered.filter((user) => {
      const firstName = user.firstName.toLowerCase();
      const lastName = user.lastName.toLowerCase();
      const email = user.email.toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const searchTerms = search.split(/\s+/);
      // 1 ord
      if (searchTerms.length === 1) {
        return (
          firstName.includes(search) ||
          lastName.includes(search) ||
          email.includes(search) ||
          fullName.includes(search)
        );
      }
      // Flera ord
      return (
        searchTerms.every(
          (term) =>
            firstName.includes(term) ||
            lastName.includes(term) ||
            fullName.includes(term)
        ) || email.includes(search)
      );
    });
  }

  // Avdelningsfilter (om aktivt)
  if (options.includeDepartment && selectedFilters.value.department) {
    filtered = filtered.filter(
      (user) => user.company?.department === selectedFilters.value.department
    );
  }

  // Titelfilter (om aktivt)
  if (options.includeTitle && selectedFilters.value.title) {
    filtered = filtered.filter(
      (user) => user.company?.title === selectedFilters.value.title
    );
  }

  return filtered;
};

// Extraherar unika värden, används för att populera filter-dropdowns
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

/* =============== BERÄKNINGAR ====================== */

// Den slutgiltiga listan efter alla filter har applicerats
const filteredEmployees = computed(() => {
  return applyFilters(allEmployees.value, {
    includeDepartment: true,
    includeTitle: true,
    includeSearch: true,
  });
});

// Anställda som ska visas på den nuvarande sidan
const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * PEOPLE_PER_PAGE;
  const end = start + PEOPLE_PER_PAGE;
  return filteredEmployees.value.slice(start, end);
});

// Dynamiskt tillgängliga avdelningar för dropdown-menyn
const availableDepartments = computed(() => {
  const relevantUsers = applyFilters(allEmployees.value, {
    includeDepartment: false,
    includeTitle: true,
    includeSearch: true,
  });
  return extractUniqueValues(
    relevantUsers,
    'department',
    selectedFilters.value.department
  );
});

// Dynamiskt tillgängliga titlar för dropdown-menyn
const availableTitles = computed(() => {
  const relevantUsers = applyFilters(allEmployees.value, {
    includeDepartment: true,
    includeTitle: false,
    includeSearch: true,
  });
  return extractUniqueValues(
    relevantUsers,
    'title',
    selectedFilters.value.title
  );
});

// Totalt antal sidor för pagination
const totalPages = computed(() => {
  return Math.ceil(filteredEmployees.value.length / PEOPLE_PER_PAGE);
});

// Antal per sida
const displayedCount = computed(() => {
  const totalResults = filteredEmployees.value.length;
  if (totalResults === 0) return 0;
  const start = (currentPage.value - 1) * PEOPLE_PER_PAGE + 1;
  const end = Math.min(start + PEOPLE_PER_PAGE - 1, totalResults);
  return `${start}-${end}`;
});

/* =============== FILTERKEDJER ====================== */
/* ========= SÖK > AVDELNING > TITEL ========== */

// Antal träffar efter enbart sökfiltret
const searchOnlyResults = computed(() => {
  return applyFilters(allEmployees.value, {
    includeSearch: true,
    includeDepartment: false,
    includeTitle: false,
  }).length;
});

// Antal träffar efter sök + avdelningsfilter
const departmentChainResults = computed(() => {
  return applyFilters(allEmployees.value, {
    includeSearch: true,
    includeDepartment: true,
    includeTitle: false,
  }).length;
});

// Antal träffar efter sök + avdelning + titelfilter
const titleChainResults = computed(() => {
  return filteredEmployees.value.length; // Samma som slutgiltiga resultatet
});

/* =============== Event Handlers ====================== */

// Sidbyte
const handlePageChange = (page) => {
  currentPage.value = page;
  if (window.scrollY > 50) {
    scrollToTop('instant');
  }
};

// Tar bort ett specifikt filter
const removeFilter = (filterType) => {
  switch (filterType) {
    case 'search':
      searchTerm.value = '';
      break;
    case 'department':
      selectedFilters.value.department = '';
      break;
    case 'title':
      selectedFilters.value.title = '';
      break;
  }
};

// Återställer alla filter
const clearAllFilters = () => {
  searchTerm.value = '';
  selectedFilters.value.department = '';
  selectedFilters.value.title = '';
};

// smooth | instant
const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({top: 0, behavior});
};


watch(
  [searchTerm, selectedFilters],
  () => {
    currentPage.value = 1;
  },
  {deep: true}
);

onMounted(() => {
  fetchEmployees();
});
</script>

<style lang="scss" scoped>
.employee-directory {
  overscroll-behavior-y: none;
  overscroll-behavior-x: none;

  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: $spacing-2xl 0 $spacing-4xl;

  @media (min-width: 481px) {
    padding: $spacing-3xl 0 $spacing-3xl 0;
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
      align-items: flex-start;
      gap: $spacing-lg;
      padding: 0 $spacing-xs;
      margin-bottom: $spacing-sm;

      @media (min-width: 1001px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        padding: 0;

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
