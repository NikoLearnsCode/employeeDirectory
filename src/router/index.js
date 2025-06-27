import { createRouter, createWebHistory } from 'vue-router'
import EmployeeDirectoryView from '@/views/EmployeeDirectoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'employees',
      component: EmployeeDirectoryView,
    },
    
  ],
})

export default router
