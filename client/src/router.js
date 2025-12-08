import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import RegisterPage from './views/RegisterPage.vue'
import LoginPage from './views/LoginPage.vue'
import Localroom from './views/Localroom.vue'
import MainPage from './views/MainPage.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/localroom', name: 'localroom', component: Localroom },
  { path: '/main', name: 'main', component: MainPage },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
