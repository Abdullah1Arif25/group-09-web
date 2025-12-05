<template>
  <div class="home-wrapper">
    <div class="content-box">

      <!-- logo -->
      <img 
        class="logo" 
        src="@/assets/HMO_logo.png"
        alt="App Logo"
      />

      <!-- Titles -->
      <h1 class="main-title">Hear Me Out</h1>
      <h2 class="subtitle">We Listen & We Don't Judge</h2>

      <!-- Buttons -->
      <div class="button-group">
        <button class="btn-custom" @click="goRegister">Register</button>
        <button class="btn-custom" @click="goLogin">Login</button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    goRegister() {
      this.$router.push("/register");
    },
    goLogin() {
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
/* Gradient background */
.home-wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #2B0D2B, #6D2A46);
  color: white;
  text-align: center;
}

/* Container for logo, titles, and buttons */
.content-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}


.logo {
  width: 450px;
  margin-bottom: 20px;
}

/* Titles styling */
.main-title {
  font-family: "Noto Serif Ethiopic", serif;
  font-size: 45px;
  font-weight: 700;
  letter-spacing: 5px; 
  margin: 0;
}

.subtitle {
  font-size: 1.3rem;
  font-weight: 300;
  font-style: italic;
  margin-bottom: 40px;
}

/* Buttons */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.btn-custom {
  width: 200px;
  padding: 12px 0;
  border: none;
  border-radius: 30px;
  background: linear-gradient(
    90deg,
    rgba(255, 194, 194, 0.18),
    rgba(147, 100, 128, 1)
  );
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-custom:hover {
  background: linear-gradient(
    90deg,
    rgba(255, 194, 194, 0.35),
    rgba(147, 100, 128, 1)
  );
}
</style>
