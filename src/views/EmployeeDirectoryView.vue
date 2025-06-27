<template>
  <main class="employee-directory">
    <Loading v-if="isLoading && !userFriendlyError" />
    <EmployeeGrid v-else :users="allEmployees" />
    <ErrorMessage
      v-if="userFriendlyError"
      :message="userFriendlyError"
      @retry="fetchEmployees"
    />
  </main>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import Loading from '@/components/employees/Loading.vue';
import EmployeeGrid from '@/components/employees/EmployeeGrid.vue';
import ErrorMessage from '@/components/shared/ErrorMessage.vue';

//State
const allEmployees = ref([]);
const isLoading = ref(false);
const userFriendlyError = ref(null);

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

// Hooks
onMounted(() => {
  fetchEmployees();
});
</script>
