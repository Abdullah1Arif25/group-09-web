<template>
  <div class="page-wrapper">
    <div class="page-card">

      <div class="top-buttons">
        <router-link to="/profile" class="top-btn">Profile</router-link>
        <router-link
          v-if="user.userId === 'admin'"
          to="/admin"
          class="top-btn">
          Admin
        </router-link>
      </div>
      <h1 class="title">HOME PAGE</h1>

      <div class="room">

        <!-- LOCAL ROOM -->
        <router-link 
        v-if="user && user.language === 'swe'" 
        to="/localroom" class="room-card">
          <div class="room-text">LOCAL ROOM</div>
          <img
            class="room-icon"
            src="@/assets/Local_logo.png"
            alt="Local Room"
          />
        </router-link>

        <!-- GLOBAL ROOM -->
        <router-link to="/globalroom" class="room-card">
          <div class="room-text">GLOBAL ROOM</div>
          <img
            class="room-icon"
            src="@/assets/Global_logo.png"
            alt="Global Room"
          />
        </router-link>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
    };
    
  },
  computed: {
    isAdmin() {
      return this.user.userId === "admin";
    }
  }
};
</script>


<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #2b0d2b, #6d2a46);
}

.page-card {
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
}

.top-buttons {
  position: absolute;
  top: 55px;
  right: 40px;
  display: flex;        
  gap: 12px;
}

.top-btn {
  background: #e6d5deda;
  padding: 10px 40px;
  border-radius: 10px;
  color: #3a0f2a;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  transition: 0.25s ease;
}

.top-btn:hover {
  background: linear-gradient(
    90deg,
    rgba(255, 194, 194, 0.32),
    #a77b99
  );
  color: white;
}

.title {
  color: white;
  font-size: 2.8rem;
  font-weight: bold;
  margin: 20px 0 40px;
  text-align: center;
}

.room {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.room-card {
  background: linear-gradient(
    90deg,
    rgba(255, 194, 194, 0.82),
    #936480
  );
  max-width: 400px;
  height: 310px;
  border-radius: 40px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  transition: transform 0.18s ease, background 0.18s ease;
}

.room-card:hover {
  transform: scale(1.05);
  background: linear-gradient(
    90deg,
    rgba(255, 194, 194, 0.9),
    #936480
  );
}

.room-text {
  color: white;
  font-size: 2.1rem;
  font-weight: bold;
  margin-bottom: 1.8rem;
}

.room-icon {
  max-width: 260px;
  max-height: 170px;
}

@media (max-height: 700px) {
  .room-card {
    width: 320px;
    height: 250px;
    padding: 2rem;
  }

  .room-text {
    font-size: 1.6rem;
  }

  .room-icon {
    max-width: 200px;
    max-height: 130px;
  }
}

@media (max-width: 768px) {
  .room {
    flex-direction: column;
    align-items: center;
  }

  .room-card {
    max-width: 90%;
    height: auto;
    padding: 2rem;
  }

  .room-text {
    font-size: 1.6rem;
  }

  .room-icon {
    max-width: 180px;
    max-height: 140px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }

  .top-btn {
    padding: 8px 20px;
    font-size: 0.9rem;
  }
}
</style>
