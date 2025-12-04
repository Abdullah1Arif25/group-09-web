import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import LocalRoom from './views/Localroom.vue' 

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/localroom', name: 'localroom', component: LocalRoom },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
