<template>
  <div id="app">
    <div id="nav" class="navStyle">
      <router-link to="/">Home</router-link>
      <router-link to="/localroom">localroom</router-link>
    </div>
    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.navStyle{
  background-color: #2b0d2b;
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 10px;
  justify-content: center;
}

</style>
