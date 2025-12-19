<template>
  <div id="app">
    <div class="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/register">Register</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/main">Main</router-link>
      <router-link to="/profile">Profile</router-link>
      <router-link to="/localroom">Localroom</router-link>
      <router-link to="/globalroom">Globalroom</router-link>
      
    </div>

    <router-view />
  </div>
</template>

<style>
.nav {
  background: #ddd; 
  padding: 2px;
  text-align: center;
  position: relative;
  z-index: 2000;
}

.nav a {
  margin: 0 10px;
  text-decoration: none;
  color: black;
}
</style>

