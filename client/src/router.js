import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import RegisterPage from './views/RegisterPage.vue'
import LoginPage from './views/LoginPage.vue'
import LocalRoom from './views/LocalRoom.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/localroom', name: 'localroom', component: LocalRoom }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
