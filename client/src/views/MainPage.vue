<template>
  <div class="page-wrapper">
    <div class="page-card">

      <h1 class="title">HOME PAGE</h1>

      <div class="room">

        <!-- LOCAL ROOM -->
        <router-link to="/localroom" class="room-card">
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
  height: 100vh;         
}

.title {
  color: white;
  position: absolute;
  top: 40px;       
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 2.8rem;
  font-weight: bold;
  margin: 0;
}

.room {
  display: flex;
  gap: 2rem;
  justify-content: center;
}
.room-card {
  background: linear-gradient(
    90deg,
    rgba(255, 194, 194, 0.82),
    #936480
  );
  width: 400px;
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

</style>
