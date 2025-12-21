<template>
  <div class="admin-page">
    <div class="admin">

      <h1 class="admin-title">Admin Page</h1>

      <!-- Buttons -->
      <div class="controls">
        <button class="admin-button" @click="$router.push('/admin/createrooms')">
        Create Topic Rooms
        </button>
        <button class="admin-button" @click="$router.push('/admin/users')">
        Display Users
        </button>

        <button class="admin-button" @click="deleteAllMessages">
            Delete All Messages
            </button>
      </div>

      <h2 class="section-title">Chat Control</h2>

      <div class="toggle-list">
        <!-- Local Chat -->
        <div class="toggle-row">
          <div class="row-title">Local Chat</div>

          <input
            type="checkbox"
            class="toggle"
            v-model="localRoom.liveChat"
            @change="toggleLocalChat"
          />
          
          <div class="status">{{ localChatStatus }}</div>
        </div>

        <!-- Global Chat -->
        <div class="toggle-row" >
          <div class="row-title">Global Chat</div>
          <input
            type="checkbox"
            class="toggle"
            v-model="globalRoom.live_Chat"
            @change="toggleGlobalChat"
          />

          <div class="status">{{ globalChatStatus }}</div>
        </div>
      </div>

    </div>

    <!-- Popup -->
    <div v-if="showPopup" class="popup">
      <p>All messages were successfully deleted.</p>
      <button @click="showPopup = false">Continue</button>
    </div>
  </div>
</template>

<script>
import { Api } from "@/Api";

export default {
  name: "AdminPage",

  data() {
    return {
      localRoom: {
        _id: null,
        roomId: null,
        liveChat: false
      },
      globalRoom: {
        _id: null,
        live_Chat: false
      },
      showPopup: false,
    };
  },

  async mounted() {
    await this.fetchRooms();
  },

  computed: {
    localChatStatus() {
      if (this.localRoom.liveChat) {
      return "ON";
    }
    return "OFF";
  },
    globalChatStatus() {
      if (this.globalRoom.live_Chat) {
      return "ON";
    }
    return "OFF";
  }
  }, 

  methods: {
    async fetchRooms() {
        try {
            const localRes = await Api.get("/localrooms");
            this.localRoom = localRes.data[0];
            
        } catch (err) {
            console.error("Failed to load local rooms", err);
        }
        
        try {
            const globalRes = await Api.get("/globalrooms");
            this.globalRoom = globalRes.data;

        } catch (err) {
            console.error("Failed to load global rooms", err);
        }
    },  

    async toggleLocalChat() {
        await Api.put(`/localrooms/${this.localRoom._id}`, {liveChat: this.localRoom.liveChat
      });
      
    },

    async toggleGlobalChat() {
        await Api.put(`/globalrooms/${this.globalRoom.room_Id}`, {
            live_Chat: this.globalRoom.live_Chat});
    },

    async deleteAllMessages() {
        try {
            await Api.delete("/messages");
            this.showPopup = true;
        } catch (err) {
            alert("Failed to delete messages");
        }},
  }
};
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #2b0d2b, #6d2a46);
  overflow-y: auto;
}

.admin {
  max-width: 440px;
  padding: 32px 24px;
  border-radius: 40px;
  text-align: center;
  background: linear-gradient(
    90deg,
    rgba(255, 194, 194, 0.18),
    #936480);
  backdrop-filter: blur(14px);
  max-height: 90vh;    
  overflow-y: auto;
}

.admin-title {
  color: white;
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 26px;
  letter-spacing: 1px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.admin-button {
  height: 60px;
  border-radius: 100px;
  border: none;
  background: #f6e3ea;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  color: #6d2a46;
}

.admin-button:hover {
  background: linear-gradient(
    90deg,
    rgba(255, 194, 194, 0.35),
    #a77b99
  );
  color: #3a0f2a;
}

.section-title {
  color: white;
  font-size: 22px;
  font-weight: 600;
  padding: 40px 0 20px;
}

.toggle-list {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: -4px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  background: #f2dde3;
  padding: 14px 22px;
  border-radius: 100px;
  font-weight: 600;
  color: #5a2a44;
}

.row-title {
  font-size: 20px;
  font-weight: 600;
  color: #6d2a46;
}

.status {
  font-size: 14px;
  font-weight: 500;
  color: #6d2a46;
  width: 40px;
}

.toggle {
  appearance: none;
  width: 52px;
  height: 28px;
  background: #caa1b6;
  border-radius: 999px;
  position: relative;
  cursor: pointer;
}

.toggle::before {
  content: "";
  position: absolute;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: transform 0.25s ease;
}

.toggle:checked {
  background: #6d2a46;
}

.toggle:checked::before {
  transform: translateX(24px);
}

.popup {
  position: fixed;
  bottom: 30px;
  background: #6d2a46;
  color: white;
  padding: 20px 28px;
  border-radius: 22px;
  text-align: center;
  z-index: 1000;
}

.popup button {
  padding: 8px 26px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  background: #f6e3ea;
  color: #6d2a46;
  font-weight: 600;
  transition: 0.2s ease;
}

@media (max-height: 700px) {
  .admin {
    max-height: 85vh;
    padding: 24px 20px;
  }
}
</style>

