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
                :ref="`msg-${msg.messageId}`"
                class="messageRow"
                :class="[String(msg.senderId) === String(this.senderObjectId) ? 'my-message':'others-message',
                    activeMessageOption === msg.messageId ? 'messageActive' : ''
                ]">
                <!--Parent Message If Responce Ids-->
                <!--If the current message is a responce to another message it should display the parent message on top-->
                <!--We can take the parent message and fetch its content on the fly and when the user sends the response message we just attact it -->
                

                <div class="messageDetailWrapper">
                    <div
                    v-if="msg.ParentMessageId"
                    class="replyPreview"
                    @click="goToMessage(msg.ParentMessageId.MessageId)"
                    >
                    <div class="replyBar"></div>
                    <div class="replyContent">
                        <small class="replyLabel">Replying to</small>
                        <p class="replyText">
                            {{ msg.ParentMessageId.Body }}
                        </p>
                    </div>
                </div>

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
                    <!-- Everyone can reply -->
                    <button class="optionMenuButton" @click="replyToMessage(msg)">Reply</button>
                    <!-- Everyone can react -->
                    <button class="optionMenuButton" @click="toggleReactionMenu(msg)">React</button>
                    <!-- only sender can edit -->
                    <button
                      v-if="String(msg.senderId) === String(senderObjectId)"
                      class="optionMenuButton"
                      @click="editMessage(msg)">Edit</button>
                    <!-- only sender can delete -->
                    <button
                      v-if="String(msg.senderId) === String(senderObjectId)"
                      class="optionMenuButton"
                      @click="deleteMessage(msg)">Delete</button>

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

        <div v-if="chatPaused" class="chatPaused">
          {{ chatPausedMessage }}
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
                    <input class ='messageBoxStyle'type="text" v-model="message" :disabled="chatPaused" :placeholder=" 
                      chatPaused ? 'Chat is paused' : 
                      isEditing ? 'Editing message…' : 
                      'Send a confession or help a fellow....' " />
                        <button class="sendbuttonInside" type="submit" :disabled="chatPaused">
                            <FontAwesomeIcon  icon="paper-plane" size="xl"style="color: #2b0d2b;"  />
                        </button>
                        <button v-if="isEditing" class="cancelbuttonInside" @click="cancelEdit">
                          <FontAwesomeIcon  icon="fa-solid fa-xmark" size="xl"style="color: #2b0d2b;" />
                        </button>
                </form>
            </div>

            <div class="ThemeToggle">
              <button class="ThemeToggle" @click="toggleTheme">
                {{ isLight ? "🌙 Dark" : "☀ Light" }}
              </button>
            </div>

            <!-- Exit button -->
            <div class="exitButtonWrapper">
            <button class="buttonIconStyle" @click="showSettings = true">
               <FontAwesomeIcon icon="arrow-right-from-bracket" size="2xl"style="color: aliceblue;" />
                </button>
            </div>

        </div>
    </div>
    <SettingsPopup v-if="showSettings" @close="showSettings = false"/>
</template>



<script>
import { Api } from '@/Api';
import { socket } from '@/socket/client.socket';
import { getUserObjectId } from '@/cache/user.cache.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import SettingsPopup from "./SettingsPopup.vue";
import {followLink} from "../services/hateoas.service";

const REACTIONS = [
  { type: "like", emoji: "👍" },
  { type: "love", emoji: "❤️" },
  { type: "laugh", emoji: "😂" },
  { type: "sad", emoji: "😢" },
  { type: "angry", emoji: "😡" }
];

export default {
    name: 'localroom',
    components: {
        FontAwesomeIcon,
        SettingsPopup
    },


  data() {
    return {
      message: '',
      isMenuOpen: false,
      branchingRoomTopic: 'General',
      branchingRoomId: '',
      messages: [],
      senderObjectId: getUserObjectId(),
      socket,
      chatListner: null,
      activeMessageOption: null,
      parentMessageId: '',
      parentMessageContent: '',
      showReactionsForMessage: null,
      REACTIONS,
      replyBannerActive: '',
      isLight: false,
      showSettings: false,
      selectedMessageId:'',
      chatPaused: false,
      chatPausedMessage: "",
      messageInput: "",
      isEditing: false,
      originalEditMessage: '',
      messageRelatedLinks:null,
      selectedMessageId: null,


      

    };
  },

  beforeUnmount() {
    if (this.socket && this.chatListner) {
      this.socket.off("chat message", this.chatListner);
      this.socket.off("respond to a message", this.chatListner);
      this.socket.off("respond to a message", (msg)=>{

      });

    }
  },

  async mounted() {
    await this.getAllBranhingRooms();
    this.scrollToBottom();

    if (!this.socket.connected) {
      this.socket.connect();
    }

    this.chatListner = (msg) => {
      const exists = this.messages.some(m => m.messageId === msg.messageId);
      if (exists) return;

      console.log("This is a message we are testing",msg);

      this.messages.push({
        messageId: msg.messageId,
        Body: msg.Body,
        timestamp: msg.SendTimestamp,
        ResponseIds: msg.ResponseIds || [],
        senderId: msg.Sender,
        ParentMessageId: msg.ParentMessageId?{
            Body: msg.ParentMessageId.Body,
            MessageId: msg.ParentMessageId.messageId,
            messageObjectId: msg.ParentMessageId._id,
        }: null,
        messageObjectId: msg._id,
        anonymousName: msg.senderAnonymousName,
        reactions: msg.Reactions || [],
        _links :msg._links|| null,
      });
      console.log(this.messages);

      this.$nextTick(this.scrollToBottom);
    };

    this.socket.on("chat message", this.chatListner);
    this.socket.on("respond to a message", this.chatListner);
    this.socket.on("react to message", (msg)=>{
        const target = this.messages.find(m=> m.messageId === msg.messageId);
        if(target) target.reactions = msg.Reactions || [];
    });

    if (this.branchingRoomId && this.senderObjectId) {
      this.socket.emit("join room", {
        userId: this.senderObjectId,
        roomId: this.branchingRoomId
      });
    }


    this.socket.on("chat status changed", (data) => {
    if (data.roomType !== "LocalRoom") 
      return;
    this.chatPaused = !data.live;
    this.chatPausedMessage = this.chatPaused ? "Chat is currently paused by admin" : "";});
    
    this.socket.on("chat paused", (data) => {
      this.chatPaused = true;
      this.chatPausedMessage = data.message;
    });

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

      this.chatPaused = false;
      this.chatPausedMessage = "";
    }
  },

  methods: {
    DisableReplyBanner(){
        this.replyBannerActive ='';
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


    goToMessage(parentMessageId){
       this.$nextTick(()=>{
        const ref = this.$refs?.[`msg-${parentMessageId}`];
        const el = Array.isArray(ref)? ref[0]:ref;

        if(!el){
            console.warn("No Dom ref for mresage", parentMessageId);
            return;
        }
         el.scrollIntoView({
                behavior:"smooth"
            });
       });

    },

    openOptionMenu(messageId) {
      this.activeMessageOption = messageId;
      const msg = this.messages.find(m => m.messageId === messageId);
      this.messageRelatedLinks = msg?._links || null;
      console.log("this is the message", msg);
      console.log("this is the message related links", this.messageRelatedLinks);


    },


    

    closeOptionMenu() {
      this.activeMessageOption = null;
      this.showReactionsForMessage = null;
      this.messageRelatedLinks = null;

    },

    openMenu() {
      this.isMenuOpen = true;
    },

    ifParentMessage(msg){
        if(msg.ParentMessageId) return true;
    },

    closeMenu() {
      this.isMenuOpen = false;
    },

    async editMessage(msg){
      this.isEditing = true;
      this.selectedMessageId = msg.messageId;
      this.originalEditMessage = msg.Body; 
      this.message = msg.Body;
      this.closeOptionMenu();

    },

    async deleteMessage(msg){

      try{
        console.log(msg);
        const deleteLink = msg?._links?.deleteMessage;
        if(!deleteLink){
          console.log("No Delete Link on message");
          return;
        }
        await followLink(deleteLink);
        this.activeMessageOption = '';
        this.fetchMessages();
      }catch(err){
        console.err("Delete Failed", err);
      }


    },

    async replyToMessage(msg) {
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
          branchingRoomType: "LocalRoom",
          language: user.language
        }
      });

      const room = res.data.Body?.[0];
      this.branchingRoomId = room ? room.branchingRoomId : '';
      console.log(this.branchingRoomId);

      if (this.branchingRoomId) {
        await this.fetchMessages();
      }
    },

    async fetchMessages() {
      const res = await Api.get(
        `/branchingrooms/${this.branchingRoomId}/messages`
      );

      this.messages = res.data.map(m => ({
        senderId: m.Sender._id,
        ParentMessageId: m.ParentMessageId ? {
            ParentMessageObjectId:m.ParentMessageId._id,
            Body:m.ParentMessageId.Body,
            MessageId: m.ParentMessageId.messageId,
        }: null,
        messageObjectId: m._id,
        ResponseIds: m.ResponseIds,
        messageId: m.messageId,
        anonymousName: m.anonymousName,
        Body: m.Body,
        timestamp: m.SendTimestamp,
        reactions: m.Reactions || [],
        _links:m._links|| null,
      }));
    },

    async sendMessage() {
      if (!this.message.trim()) return;
        if (this.isEditing && this.selectedMessageId) {
          try {
            const msg = this.messages.find(m=> m.messageId === this.selectedMessageId);
            await followLink(msg._links.updateMessage, {Body:this.message});

            this.isEditing = false;
            this.selectedMessageId = null;
            this.message = '';
            this.replyBannerActive = '';
            this.parentMessageContent = '';
            
            await this.fetchMessages();
            return;
          } catch (err) {
            console.error("Failed to edit message:", err);
            return;
          }
        }
      const messageId = this.parentMessageId
        ? `responceMessageId${Math.floor(Math.random() * 100000)}`
        : `messageId${Math.floor(Math.random() * 100000)}`;

      const payload = {
        messageId,
        Body: this.message,
        SendTimestamp: new Date().toISOString(),
        Reaction: null,
        ResponseIds: [],
        Sender: this.senderObjectId,

      };

      if (this.parentMessageId) {
          const msg = this.messages.find(m=> m.messageId === this.parentMessageId);
          console.log(msg._links.createResponse);
          await followLink(msg._links.createResponse, payload);
        this.parentMessageId = '';
      } else {
          await Api.post(`/branchingrooms/${this.branchingRoomId}/messages/`, payload);
      }

      this.message = '';
      this.replyBannerActive='';
      this.parentMessageContent="";

    },

    toggleReactionMenu(msg) {
      this.showReactionsForMessage =
        this.showReactionsForMessage === msg.messageId ? null : msg.messageId;
    },

    async reactToMessage(messageId, reaction) {
        const originalMessage = await Api.get( `/branchingrooms/${this.branchingRoomId}/messages/${messageId}`);
        const reactionList = originalMessage.data.Reactions;

        const existingReaction = reactionList.find(
          r => r.userId === this.senderObjectId
        );
        if (existingReaction){
            throw new Error("Only one reaction is reaction")
            return;
        };

        const payload = {
            branchingRoomId: this.branchingRoomId, 
            messageId: messageId, 
            userId: this.senderObjectId,
            reaction: reaction
            
        }

        const msg = this.messages.find(m => m.messageId === messageId);

        followLink(msg._links.reactToMessage, payload);

      if (msg) {
        msg.reactions = res.data.reactions || [];
      }

      this.closeOptionMenu();
    }, 

    toggleTheme() {
            this.isLight = !this.isLight;
        },

    cancelEdit() {
      this.isEditing = false;
      this.selectedMessageId = null;
      this.message = '';              
      this.originalEditMessage = ''; 
    },
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

.parentMessageDisplay{
    display: flex;
    flex:1;
    background:#fdfdfd;
    border-radius: 10px;
    height: 20px;
    width: 100%;
    top: 100%;
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

.cancelbuttonInside {
    background: transparent;
    border: none;
    position: absolute;
    right: 80px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
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

.reaction-left {
  left: 12px;
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


.replyPreview {
  display: flex;
  
  gap: 8px;
  margin-bottom: 6px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.08);
  top: 100%;
  left: 1px;
  right: 1px;
}

.replyBar {
  width: 4px;
  border-radius: 2px;
}

.replyContent {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.replyLabel {
  font-size: 0.7rem;
  opacity: 0.7;
}

.replyText {
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chatPaused {
  background: rgba(0,0,0,0.7);
  color: #2b0d2b;
  padding: 10px;
  border-radius: 12px;
  margin: 6px 12px;
  text-align: center;
  font-weight: 600;
}

.messageBoxStyle:disabled::placeholder {
  color:#2b0d2b; 
  font-weight: bold;   
}





</style>



