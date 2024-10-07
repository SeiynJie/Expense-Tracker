import { createRouter, createWebHistory } from 'vue-router'
import Template from '../views/Template.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Template
    },
    {
      path: '/about',
      name: 'about',
      component: HomeView
    }
  ]
})

export default router
