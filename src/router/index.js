import { createRouter, createWebHistory } from 'vue-router'
import Template from '../views/Template.vue'
import HomeView from '@/views/HomeView.vue'
import Register from '@/views/Register.vue'
import SignIn from '@/views/SignIn.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    }
  ]
})

export default router
