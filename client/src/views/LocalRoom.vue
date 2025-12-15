<template>
        <div class="backgroundStyle" :class="{ light: isLight }">

        <!-- Head banner -->
        <div class="head_banner">

            <!-- Left logo -->
            <div class="logoWrapper">
                <img class="logo" 
                src="@/assets/HMO_logo.png" 
                alt="App Logo" />
            </div>


        <!-- Localroom title and branching room type -->
            <div class="HeaderFlexBox">
                <h1 class="head_title_style">LOCAL ROOM</h1>

                <div class="categoryDivStyle">
                    <h2 class="categoryTitleStyle">
                        {{ this.branchingRoomTopic}}
                    </h2>
                </div>
            </div>

            <!-- Menu button -->
            <div class="MenuButtonFlex">
                <button class="buttonIconStyle" @click="openMenu">
                    <FontAwesomeIcon icon="list-ul" size="2xl" />
                </button>
            </div>
        </div>

        <!-- Side menu -->
        <div 
            class="sideMenuOverlay" 
            v-if="isMenuOpen" 
            @click="closeMenu">
        </div>

        <div 
            class="sideMenuWrapper"
            :class="{ menuVisible: isMenuOpen }">

            <div class="sideMenuContent">
                <button class="sideMenuButton" @click="changeRoomTopic('General')">General</button>
                <button class="sideMenuButton" @click="changeRoomTopic('Scandle')">Scandle</button>
                <button class="sideMenuButton" @click="changeRoomTopic('Travel')">Travel</button>
                <button class="sideMenuButton" @click="changeRoomTopic('Movies')">Movies</button>
                <button class="sideMenuButton" @click="changeRoomTopic('Books')">Books</button>
                <button class="sideMenuButton" @click="changeRoomTopic('Sports')">Sports</button>
                <button class="sideMenuButton" @click="changeRoomTopic('Relationships')">Relationships</button>
                <button class="sideMenuButton" @click="changeRoomTopic('Food')">Pets</button>
                <button class="sideMenuButton" @click="changeRoomTopic('School')">Politics</button>
            </div>
        </div>


        <!-- Empty boom -->
        <div class="room-box" ref="messageBox">
             <div
                v-for="msg in messages"
                :key="msg.senderId" 
                :class="['messageBox-style', String(msg.senderObjectId) === String(this.senderObjectId) ? 'my-message':'others-message']">
                <p class="message-text-style">
                    {{ msg.Body }}
                </p>
                <small class="message-font-style">
                    {{ new Date(msg.timestamp).toLocaleDateString() }}
                </small>
            
            </div>

        </div>


        <!-- Footer and bottom banner -->
        <div class="messageBoxFlex">
            
            <img 
                class="profileDetailWrapper"
                src="@/assets/HMO_logo.png"
                alt="profilePic"
            />

            <div class="messageBoxWrapper">
                <div class="inputContainer">
                <input class="messageBoxStyle" type="text" v-model="message" placeholder="Send a confession or help a fellow.... "/>
                <button class="sendbuttonInside" @click="sendMessage">
                    <FontAwesomeIcon  icon="paper-plane" size="xl"  />
                    </button>
                </div>
            </div>

            <div class="ThemeToggle">
            <button class="ThemeToggle" @click="toggleTheme">
                {{ isLight ? "🌙 Dark" : "☀ Light" }}
            </button>
            </div>

            <!-- Exit button -->
            <div class="exitButtonWrapper">
            <button class="buttonIconStyle" >
               <FontAwesomeIcon icon="arrow-right-from-bracket" size="2xl" />
                </button>
            </div>

        </div>
    
    </div>

</template>



<script>
import { Api } from '@/Api';
import { socket } from '@/socket/client.socket';
import { getUserObjectId } from '@/cache/user.cache.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
    name: 'localroom',
    components: {
        FontAwesomeIcon,
    },

  data() {
    return {
      message: '',
      isMenuOpen: false,
      branchingRoomTopic: '',
      branchingRoomId: '',
      messages: [],
      senderObjectId: getUserObjectId(),
      chatListner: null,
      socket,
      isLight: false,
    };
  },

  mounted() {
    this.initSocket();
    this.getAllBranhingRooms();
  },

  beforeUnmount() {
    if (this.socket && this.chatListner) {
      this.socket.off("chat message", this.chatListner);
    }
  },

  methods: {
    toggleTheme() {
      this.isLight = !this.isLight;
    },

    async initSocket() {
      if (!this.socket.connected) this.socket.connect();

      this.chatListner = (msg) =>
        this.messages.push({
          senderObjectId: msg.senderObjectId,
          Body: msg.Body,
          timestamp: msg.timestamp,
        });

      this.socket.on("chat message", this.chatListner);
    },

    changeRoomTopic(topic) {
      this.branchingRoomTopic = topic;
      this.getAllBranhingRooms();
    },

    scrollToBottom() {
      const box = this.$refs.messageBox;
      if (box) box.scrollTop = box.scrollHeight;
    },

    openMenu() {
      this.isMenuOpen = true;
    },

    closeMenu() {
      this.isMenuOpen = false;
    },

    async getAllBranhingRooms() {
      if (!this.branchingRoomTopic) this.branchingRoomTopic = "General";

      const user = JSON.parse(localStorage.getItem("user"));
      const res = await Api.get("/branchingrooms", {
        params: {
          roomTopic: this.branchingRoomTopic,
          branchingRoomType: "LocalRoom",
          language: user.language,
        },
      });

      const room = res.data.Body[0];
      this.branchingRoomId = room?.branchingRoomId || "";

      if (this.branchingRoomId) this.fetchMessages();
    },

    async fetchMessages() {
      const res = await Api.get(`/branchingrooms/${this.branchingRoomId}/messages`);
      this.messages = res.data.map(m => ({
        senderObjectId: m.Sender?._id,
        Body: m.Body,
        timestamp: m.SendTimestamp,
      }));
    },

    async sendMessage() {
      if (!this.message.trim()) return;

      this.socket.emit("chat message", {
        Body: this.message,
        SendTimestamp: new Date().toISOString(),
        Sender: this.senderObjectId,
      });

      this.message = '';
    },
  },
};
</script>




<style scoped>


.backgroundStyle {
  background: linear-gradient(#2b0d2b, #6d2a46);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.head_banner,
.messageBoxFlex {
  background: linear-gradient(#2b0d2b, #6d2a46);
}


.light.backgroundStyle {
  background: linear-gradient(#f5e1e6, #d6b2bf);
}

.head_title_style {
  color: white;
}


.light .head_title_style {
  color: #2b0d2b; 
}

.buttonIconStyle svg {
  color: white;
}


.light .buttonIconStyle svg {
  color: #2b0d2b;
}

.light .head_banner {
  background: linear-gradient(#f3dbe3, #caa0b1);
}

.light .categoryDivStyle {
  background: #ffffff;
}

.light .categoryTitleStyle {
  color: #5a2b44;
}

.light .room-box {
  background: linear-gradient(#f5e1e6, #d6b2bf);
}

.light .sideMenuWrapper {
  background: rgba(255, 255, 255, 0.85);
}

.light .sideMenuButton {
  background: linear-gradient(#7a3b5a, #9a5f7a);
}

.light .messageBoxFlex {
  background: linear-gradient(#f3dbe3, #caa0b1);
}

.light .messageBoxStyle {
  background: white;
  color: #2b0d2b;
}

.light .others-message {
  background: linear-gradient(#7a3b5a, #9a5f7a);
}

.light .my-message {
  background: white;
  color: #2b0d2b;
}

.light .ThemeToggle {
  border-color: rgba(0,0,0,0.25);
  color: #2b0d2b;
}

.light .ThemeToggle:hover {
  background: rgba(0,0,0,0.08);
}


.ThemeToggle {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.35);
  color: white;
  padding: 6px 8px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: 0.3s;
}

.ThemeToggle:hover {
  background: rgba(255,255,255,0.15);
}
</style>
