<template>
    <div class="backgroundStyle">

        <!-- Head banner -->
        <div class="head_banner">

            <!-- Left logo -->
            <div class="logoWrapper">
                <img class="logo" 
                src="@/assets/HMO_logo.png" 
                alt="App Logo" />
            </div>


        <!-- Globalroom title and branching room type -->
            <div class="HeaderFlexBox">
                 <div class="roomTittle">
                    <h1 class="head_title_style">GLOBAL ROOM</h1>
                    <img
                    class="global-icon"
                    src="@/assets/Global_logo.png"
                    alt="Global Room"
                    />
                </div>


                <div class="categoryDivStyle">
                    <h2 class="categoryTitleStyle">
                        {{ this.branchingRoomTopic}}
                    </h2>
                </div>
            </div>

            <!-- Menu button -->
            <div class="MenuButtonFlex">
                <button class="buttonIconStyle" @click="openMenu">
                    <FontAwesomeIcon icon="list-ul" size="2xl" style="color: aliceblue;" />
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


        <!-- Empty room -->
        <div class="room-box" ref="messageBox" @click="closeAllOptions">


            <!--Message-->
             <div
                v-for="msg in messages"
                :key="msg.messageId" 
                class="messageRow"
                :class="[String(msg.senderId) === String(this.senderObjectId) ? 'my-message':'others-message',
                    activeMessageOption === msg.messageId ? 'messageActive' : ''
                ]">
                <div class="messageDetailWrapper">
                <small class="message-font-style">
                    {{ msg.anonymousName}}
                </small>

                <p class="message-text-style">
                    {{ msg.Body }}
                </p>

                <small class="message-font-style">
                    {{ new Date(msg.timestamp).toLocaleDateString() }}
                </small>

                </div>

                <div
                  v-if="msg.reactions && msg.reactions.length"
                  class="messageReactions">
                  <span
                    v-for="(r, index) in msg.reactions"
                    :key="index"
                    class="reactionEmoji">
                    {{ r.reaction }}
                  </span>
                </div>

                <!--Option Button-->


                <div 
                    class="optionButtonWrapper">
                    <button class="optionButtonStyle" @click.stop="openOptionMenu(msg.messageId)">•••</button>
                </div>
                
                <!-- Option Menu -->
                <div 
                    class="optionMenuOverlay"
                    v-if="activeMessageOption === msg.messageId"
                    @click.self="closeOptionMenu()">

                    <div class="optionMenuContent" @click.stop>
                        <button class="optionMenuButton" @click="replyToMessage(msg)">Reply</button>
                        <button class="optionMenuButton" @click="toggleReactionMenu(msg)">React</button>
                        <button class="optionMenuButton" @click="editMessage(msg)">Edit</button>
                        <button class="optionMenuButton" @click="deleteMessage(msg)">Delete</button>
                    </div>

                    <!-- Reaction Menu -->


                    <div
                        v-if="showReactionsForMessage === activeMessageOption"
                        class="reactionPicker">
                        <button
                            v-for="reaction in REACTIONS"
                            :key="reaction.type"
                            class="reactionButton"
                            @click="reactToMessage(this.activeMessageOption, reaction.emoji)">
                            {{ reaction.emoji }}
                        </button>
                    </div>
                </div>

            </div>

        </div>

        <!--Parent Message in case of responce-->   
        <div
         v-if="this.replyBannerActive"
         class ="parentMessageResponceLayout"
         :class="[this.replyBannerActive ? showParentMessage: '']">

         <div class="parentMessageTextLayout">
            <small>Replying to {{this.replyBannerActive }}</small>
            <p>{{this.parentMessageContent }}</p>

         </div>
         <button @click.self="DisableReplyBanner()" class="closeButtonIconStyle">x</button>


        </div>

        
        <!-- Footer and bottom banner -->
        <div class="messageBoxFlex">
            
            <img 
                class="profileDetailWrapper"
                src="@/assets/HMO_logo.png"
                alt="profilePic"
            />

            <div class="messageBoxWrapper">
                <form class="inputContainer" @submit.prevent="sendMessage">
                    <input class ='messageBoxStyle'type="text" v-model="message" placeholder="Send a confession or help a fellow.... "/>
                        <button class="sendbuttonInside" type="submit">
                            <FontAwesomeIcon  icon="paper-plane" size="xl"style="color: #2b0d2b;"  />
                        </button>
                </form>
            </div>

            <div class="settingButtonWrapper" @click="showSettings = true">
            <button class="buttonIconStyle" >
               <FontAwesomeIcon icon="gear" size="2xl"style="color: aliceblue;" />
                </button>
            </div>

            <!-- Exit button -->
            <div class="exitButtonWrapper">
            <button class="buttonIconStyle" @click="exitRoom()">
               <FontAwesomeIcon icon="arrow-right-from-bracket" size="2xl"style="color: aliceblue;" />
                </button>
            </div>

        </div>
        <div v-if="isFrozen" class="frozen-overlay">
            <div class="frozen-card">
                <p class="frozen-text">
                    Chat is paused. This room is currently unavailable.
                </p>
                <button class="frozen-exit-button" @click="goToMain">
                    Exit
                 </button>
            </div>
        </div>

    </div>
    <SettingsPopup v-if="showSettings" @close="showSettings = false" />
</template>



<script>
import { Api } from '@/Api';
import { socket } from '@/socket/client.socket';
import { getUserObjectId } from '@/cache/user.cache.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import  SettingsPopup  from './SettingsPopup.vue';

export default {
    name: 'globalroom',
    components: {
        FontAwesomeIcon,
        SettingsPopup
    },

    data() {
        return {
            message : '',
            isMenuOpen: false ,
            branchingRoomTopic: '',
            branchingRoomId : '',
            messages:[],
            senderObjectId:getUserObjectId(),
            chatListner: null,
            socket,
            isFrozen: false,
            showSettings: false
        };
    },
    beforeUnmount(){
        if(this.socket && this.chatListner){
            this.socket.off("chat message", this.chatListner);
            this.socket.off("chat-frozen");
            this.socket.off("chat-unfrozen");
        }
    },
    async mounted(){
        await this.getAllBranhingRooms();

    if (!this.socket.connected) {
      this.socket.connect();
    }

        this.chatListner = (msg)=>
            this.messages.push({
                senderId: msg.senderObjectId,
                anonymousName: msg.sender,
                Body: msg.Body,
                timestamp:msg.timestamp

            });
        this.$nextTick(()=>{
            this.scrollToBottom();
        });
        this.socket.on("chat message",this.chatListner);

        this.socket.on("chat-frozen", () => {
            this.isFrozen = true;});
            
        this.socket.on("chat-unfrozen", () => {
            this.isFrozen = false;});

         this.$nextTick(() => {
            this.scrollToBottom();
        });


    if (this.branchingRoomId && this.senderObjectId) {
      this.socket.emit("join room", {
        userId: this.senderObjectId,
        roomId: this.branchingRoomId
      });
    }
  },

  watch: {
    messages() {
      this.$nextTick(this.scrollToBottom);
    },

    branchingRoomId(newId) {
      if (!newId || !this.senderObjectId) return;

      this.socket.emit("join room", {
        userId: this.senderObjectId,
        roomId: newId
      });

      this.fetchMessages().then(() => {
        this.$nextTick(this.scrollToBottom);
      });
    }
  },

  methods: {
    DisableReplyBanner(){
        this.replyBannerActive = false;
    },
    closeAllOptions(){
        this.closeOptionMenu();
        this.closeMenu();


    },
    changeRoomTopic(newTopic) {
      this.branchingRoomTopic = String(newTopic);
      this.getAllBranhingRooms();
      this.closeMenu();
    },

    scrollToBottom() {
      const box = this.$refs.messageBox;
      if (box && box.lastElementChild) {
        box.lastElementChild.scrollIntoView({ behavior: 'smooth' });
      }
    },

    openOptionMenu(messageId) {
      this.activeMessageOption = messageId;
    },

    closeOptionMenu() {
      this.activeMessageOption = null;
      this.showReactionsForMessage = null;
    },

    openMenu() {
      this.isMenuOpen = true;
    },

    closeMenu() {
      this.isMenuOpen = false;
    },

    async replyToMessage(msg) {
      await Api.get(`/branchingrooms/${this.branchingRoomId}/messages/${msg.messageId}`);
      this.parentMessageId = msg.messageId;
      this.replyBannerActive = msg.messageId;
      this.parentMessageContent = msg.Body;
      this.closeOptionMenu();
    },

    async getAllBranhingRooms() {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await Api.get("/branchingrooms", {
        params: {
          roomTopic: this.branchingRoomTopic || "General",
          branchingRoomType: "GlobalRoom",
          language: user.language
        }
      });

      const room = res.data.Body?.[0];
      this.branchingRoomId = room ? room.branchingRoomId : '';

      if (this.branchingRoomId) {
        await this.fetchMessages();
      }
    },

        async fetchMessages(){
            try{
                const allMessage = await Api.get(`/branchingrooms/${this.branchingRoomId}/messages`);
                this.messages = allMessage.data.map((m)=>({
                    senderObjectId: m.Sender._id || m.Sender || null,
                    anonymousName: m.anonymousName,
                    Body: m.Body,timestamp:
                    m.SendTimestamp,

                }));

            } catch(err){
                console.log(err);

            }
        },

         async sendMessage(){
            try{

                if (this.isFrozen) return;
                if(!this.message.trim()) return;

                if(!this.branchingRoomId){
                    console.log("No Branching room selected");
                    return;
                }


                if (!this.senderObjectId) {
                    console.error("No sender ID in cache (user not logged in or cache lost)");
                    this.$router.push('/login');
                    return;
                }
                const messageId = "messageId" + Math.floor(Math.random() *100000);
                const  currentTime = new  Date().toISOString();
                const messageData =  {
                    messageId: messageId,
                    Body: this.message,
                    SendTimestamp: currentTime,
                    Reaction: null,
                    ResponseIds: [],
                    Sender: this.senderObjectId
                    

                };
                if (this.socket) {
                  this.socket.emit("chat message", messageData);
                }

                this.message = '';

            } catch(err){
                console.log(err);
            }
        },

        goToMain() {
            this.$router.push("/main");
        }

    }
}
   
</script>


<style>

.backgroundStyle {
    background-image: linear-gradient(#2b0d2b, #6d2a46);
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
}

/* Header */
.head_banner {
    background-image: linear-gradient(#2b0d2b, #6d2a46);
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: clamp(6px, 1vw, 26px) clamp(0px, 0vw, 15px);
    padding-right: 10px;
    align-items: center;
    justify-content: space-between;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    z-index: 1000;
    height: var(--header-h);
}

.logoWrapper,
.MenuButtonFlex {
    flex: 1;
    display: flex;
    align-items: center;
}

.global-icon {
    width: 35px;  
    height: 40px;
    object-fit: contain;
}

.logoWrapper {
    justify-content: flex-start;
}

.MenuButtonFlex {
    justify-content: flex-end;
}

.logo {
    width: clamp(55px, 12vw, 100px);
}

.HeaderFlexBox {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.head_title_style {
    font-size: clamp(10px, 5vw, 35px);
    font-weight: bolder;
    color: rgb(249, 249, 249);
    margin: 0;
}

.categoryDivStyle {
    background-color: #ffecec;
    border-radius: 10px;
    padding: 6px 16px;
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(200px, 20vw, 400px);
    max-width: 70%;
}

.categoryTitleStyle {
    font-size: clamp(14px, 2vw, 50px);
    margin: 0;
    color: #2b0d2b;
}

/* Room Container */
.room-box {
    background: linear-gradient(#2b0d2b, #6d2a46);
    flex: 1;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    padding: 80px 12px 90px;
}

/* Side Menu */
.sideMenuOverlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    z-index: 1500;
}

.sideMenuWrapper {
    position: fixed;
    top: var(--header-h);
    right: -360px;
    width: clamp(300px, 35vw, 400px);
    height: calc(100dvh - var(--header-h) - var(--footer-h));
    background: rgba(255, 255, 255, 0.535);
    backdrop-filter: blur(6px);
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
    padding: 14px 9px;
    transition: right 0.35s ease;
    z-index: 1600;
    overflow-y: auto;
    overflow-x: hidden;
}

.sideMenuWrapper.menuVisible {
    right: 0;
}

.sideMenuContent {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sideMenuButton {
    width: 100%;
    padding: 12px 0px;
    background: linear-gradient(#2b0d2b, #6d2a46);
    border: none;
    border-radius: 16px;
    color: #fff;
    font-size: clamp(10px, 5vw, 20px);
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s ease;
}

.sideMenuButton:hover {
    opacity: 0.8;
    transform: scale(1.02);
}

/* Messages */
.messageRow {
    position: relative;
    padding: clamp(5px, 1vw, 35px) clamp(15px, 2vw, 40px);
    width: fit-content;
    max-width: clamp(320px, 80vw, 900px);
    min-width: clamp(220px, 45vw, 320px);
    display: flex;
    flex-direction: row;
    margin: 6px 0;
    border-radius: 10px;
}

.messageActive {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25);
}

.my-message {
    align-self: flex-end;
    background: linear-gradient(#ffc2c2, #936480);
    color: #2b0d2b;
    border-bottom-right-radius: 2px;
}

.others-message {
    align-self: flex-start;
    background: linear-gradient(#311731, #4f2d3b);
    color: #ffffff;
    border-bottom-left-radius: 2px;
}

.others-message .message-text-style {
    color: #ffffff;
}

.others-message .message-font-style {
    color: rgba(255, 255, 255, 0.75);
}

.message-text-style {
    margin: 0 0 3px 0;
}

.message-font-style {
    font-size: 1wmax;
    opacity: 0.7;
}

.messageDetailWrapper {
    display: flex;
    flex: 2;
    flex-direction: column;
    min-height: 0; 
    overflow: visible;
}


.messageBoxFlex {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(#2b0d2b, #6d2a46);
    padding: clamp(2px, 1.5vw, 25px) clamp(2px, 0.5vw, 10px);
    display: flex;
    align-items: center;
    gap: clamp(2px, 0.5vw, 5px);
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    z-index: 1000;
    height: var(--footer-h);
}

.profileDetailWrapper {
    width: 6vmax;
    height: 5vmax;
    border-radius: 1000px;
    object-fit: cover;
}

.messageBoxWrapper {
    flex: 1;
    display: flex;
    justify-content: center;
}

.inputContainer {
    position: relative;
    width: 100%;
}

.messageBoxStyle {
    width: 100%;
    height: 45px;
    border-radius: 12px;
    border: none;
    padding-left: 14px;
    padding-right: 50px;
    font-size: clamp(1.5rem, 8vw, 5rem);
}

.parentMessageResponceLayout{
    position: fixed;
    bottom:var(--footer-h);
    display: flex;
    left:12px;
    right:12px;
    width: auto;
    margin-top: 8px;
    background: rgba(193, 133, 178, 0.92);
    backdrop-filter: blur(8px);
    border-radius: 14px;
    padding: 10px;
    z-index: 20000;
    height: clamp(7vh, 65px, 15vh);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
}

.parentMessageTextLayout{
    flex-direction: column;
    flex: 3dvh;

}
.showParentMessage{
    right: 30px;
}

.sendbuttonInside {
    background: transparent;
    border: none;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

.roomTittle {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}


/* Option Menu */
.optionButtonWrapper {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.optionButtonStyle {
    background: transparent;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease;
}

.optionButtonStyle:hover {
    background: rgba(255, 255, 255, 0.18);
}

.optionMenuOverlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    margin-top: 8px;
    background: rgba(40, 20, 35, 0.92);
    backdrop-filter: blur(8px);
    border-radius: 14px;
    padding: 10px;
    z-index: 20000;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
}

.others-message.optionMenuOverlay {
    left: 10px;
    right: auto;
}

.optionMenuOverlay.visibleOption {
    right: 0;
}

.optionMenuContent {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: space-between;
}

.optionMenuButton {
    all: unset;
    flex: 1;
    padding: 12px 0;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    color: #fff;
    text-align: center;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.18);
    transition: background 0.15s ease, transform 0.15s ease;
}

.optionMenuButton:hover {
    background: rgba(255, 255, 255, 0.28);
    transform: translateY(-1px);
}


.settingButtonWrapper,
.exitButtonWrapper {
    display: flex;
}

.buttonIconStyle {
    background: transparent;
    border: none;
    cursor: pointer;
}

.closeButtonIconStyle {
    background: transparent;
    border: none;
    cursor: pointer;
}
.messageBox-style {
    color: #fdfdfd;
}


:root {
    --header-h: clamp(95px, 15vh, 130px);
    --footer-h: clamp(70px, 10vh, 100px);
}

.reactionPicker {
    position: absolute;
    bottom: 100%;
    left: 0;
    background: rgba(40, 20, 35, 0.95);
    backdrop-filter: blur(8px);
    border-radius: 14px;
    padding: 8px;
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    z-index: 20001;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
}

.reactionButton {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 10px;
    padding: 6px 10px;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
}

.reactionButton:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
}

.messageReactionFloating {
  position: absolute;
  bottom: -12px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(6px);
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}


.reaction-right {
  right: 12px;
}

.frozen-overlay {
  position: fixed;
  inset: 0;
  background: rgba(117, 92, 117, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.frozen-card {
  background: linear-gradient(#4a1f3c, #6d2a46);
  padding: 30px 40px;
  border-radius: 28px;
  text-align: center;
  max-width: 420px;
  width: 85%;
}

.frozen-text {
  color: #f6e6e6;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
}

.frozen-exit-button {
  background: linear-gradient(#ffc2c2, #936480);
  border: none;
  border-radius: 20px;
  padding: 12px 36px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}
</style>
