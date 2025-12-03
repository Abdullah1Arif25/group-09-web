import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import RegisterPage from './views/RegisterPage.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/register', name: 'Register', component: RegisterPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
