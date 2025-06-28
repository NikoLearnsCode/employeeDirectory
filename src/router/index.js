import {createRouter, createWebHistory} from 'vue-router';
import EmployeeDirectoryView from '@/views/EmployeeDirectoryView.vue';
import NotFound from '@/views/NotFound.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'employees',
      component: EmployeeDirectoryView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    },
  ],
});

export default router;
