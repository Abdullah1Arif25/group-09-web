import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import RegisterPage from './views/RegisterPage.vue'
import LoginPage from './views/LoginPage.vue'
import LocalRoom from './views/LocalRoom.vue'
import MainPage from './views/MainPage.vue'
import PasswordPage from './views/PasswordPage.vue'
import ProfilePage from './views/ProfilePage.vue';


const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/localroom', name: 'localroom', component: LocalRoom },
  { path: '/main', name: 'main', component: MainPage },
  { path: '/password', name: 'password', component: PasswordPage },
  { path: '/profile', name: 'profile', component: ProfilePage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
