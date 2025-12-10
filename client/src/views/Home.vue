<template>
  <nav class="soft-navbar">
    <div class="nav-left">
      <a class="nav-item" @click="$router.push('/')">Home</a>
      <span class="divider">|</span>
      <a class="nav-item" @click="$router.push('/about')">About</a>
    </div>

    <div class="nav-right">
      <a class="nav-item" @click="$router.push('/contact')">Contact</a>
      <span class="divider">|</span>
      <a class="nav-item" @click="$router.push('/support')">Support</a>
    </div>
  </nav>

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

    <footer class="footer">© 2025 Hear Me Out — We Listen & We Don't Judge</footer>

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
/* Navbar */
.soft-navbar {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  border-radius: 40px;
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(255, 194, 194, 0) 0%,
    rgba(145, 90, 123, 0.42) 100%
  );
  backdrop-filter: blur(50px);
  z-index: 10;
}

.nav-item {
  color: rgba(255,255,255,0.85);
  font-size: 1.05rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: 0.3s;
  text-decoration: none;
}

.nav-item:hover {
  color: white;
}


.divider {
  color: rgba(255,255,255,0.4);
  margin: 0 10px;
  font-size: 1.1rem;
}


.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

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


.content-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}


.logo {
  width: 350px;
  margin-bottom: 20px;
}

/* Titles styling */
.main-title {
  font-family: "Noto Serif Ethiopic", serif;
  font-size: 38px;
  font-weight: 700;
  letter-spacing: 5px; 
  margin: 0;
}

.subtitle {
  font-size: 1.15rem;
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

.footer {
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
  letter-spacing: 1px;
}
</style>
