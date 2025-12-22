<template>
  <nav class="soft-navbar">
    <div class="nav-left">
      <a class="nav-item" @click="$router.push('/')">Home</a>
      <span class="divider">|</span>
      <a class="nav-item active">About</a>
    </div>

    <div class="nav-right">
      <a class="nav-item" @click="$router.push('/contact')">Contact</a>
      <span class="divider">|</span>
      <a class="nav-item" @click="$router.push('/profile')">profile</a>
    </div>
  </nav>

  <div class="about-wrapper">
    <div class="content-box">

      <h1 class="main-title">About Hear Me Out</h1>

      <p class="about-text">
        <strong>Hear Me Out</strong> is a safe and supportive platform created
        to give people a space to express themselves freely.
        Our goal is simple: to listen without judgment.
      </p>

      <p class="about-text">
        This project was developed as part of a university course in
        web engineering. It combines modern web technologies with a strong
        focus on user experience, accessibility, and responsive design.
      </p>

      <p class="about-text">
        We believe that everyone deserves to be heard. Whether you're sharing
        thoughts, feelings, or experiences, Hear Me Out is built to encourage
        openness, empathy, and respectful interaction.
      </p>

      <p class="about-text muted">
        Built by a student team passionate about meaningful digital spaces.
      </p>

    </div>

    <footer class="footer">
      © 2025 Hear Me Out — We Listen & We Don't Judge
    </footer>
  </div>
</template>

<script>
export default {
  name: "About"
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}


.soft-navbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 92%;
  max-width: 1100px;
  min-height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  border-radius: 40px;
  background: rgba(145, 90, 123, 0.42);
  backdrop-filter: blur(50px);
  z-index: 100;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: color 0.3s;
  text-decoration: none;
  white-space: nowrap;
}

.nav-item:hover,
.nav-item.active {
  color: white;
}

.divider {
  color: rgba(255, 255, 255, 0.4);
  margin: 0 10px;
  font-size: 1.1rem;
}

/* Page layout */
.about-wrapper {
  min-height: 100vh;
  padding-top: 140px;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(90deg, #2B0D2B, #6D2A46);
  color: white;
  text-align: center;
}

.content-box {
  max-width: 700px;
  padding: 0 20px;
}

.main-title {
  font-family: "Noto Serif Ethiopic", serif;
  font-size: 28px;
  letter-spacing: 2px;
  margin-bottom: 30px;
}

.about-text {
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 22px;
  color: rgba(255, 255, 255, 0.9);
}

.about-text.muted {
  margin-top: 35px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.footer {
  margin-top: auto;
  padding: 20px 10px 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  letter-spacing: 1px;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .soft-navbar {
    flex-direction: column;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 26px;
  }

  .divider {
    display: none;
  }

  .main-title {
    font-size: 24px;
  }
}
</style>
