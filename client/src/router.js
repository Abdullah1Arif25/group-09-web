import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import LoginPage from './views/LoginPage.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/localroom', name: 'localroom', component: LocalRoom }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
