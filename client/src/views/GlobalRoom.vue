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
                    <!-- only sender can delete -->
                    <button class="optionMenuButton" @click="translateMessage(msg)">Translate</button>

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
                    <input class ='messageBoxStyle'type="text" v-model="message" :disabled="chatPaused" :placeholder="chatPaused ? 'Chat is paused' : 'Send a confession or help a fellow....'"/>
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
               <FontAwesomeIcon icon="arrow-right-from-bracket" size="2xl" style="color: aliceblue;"/>
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
const REACTIONS = [
  { type: "like", emoji: "👍" },
  { type: "love", emoji: "❤️" },
  { type: "laugh", emoji: "😂" },
  { type: "sad", emoji: "😢" },
  { type: "angry", emoji: "😡" }
];

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
            activeMessageOption: null,
            parentMessageId: '',
            showReactionsForMessage: null,
            REACTIONS,
            replyBannerActive: null,
            parentMessageContent: '',
            isLight: false,
            showSettings: false,
            chatPaused: false,
            chatPausedMessage: "",
            messageInput: "",
            selectedMessageId: null,
            isEditing: false,
            originalEditMessage: '',

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

        if(!this.socket.connected){
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

         this.$nextTick(() => {
            this.scrollToBottom();
        });


        if (this.branchingRoomId && this.senderObjectId) {
          this.socket.emit("join room", {
            userId: this.senderObjectId,
            roomId: this.branchingRoomId,
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
        branchingRoomId(newId, oldId) {
        if (!newId || !this.socket || !this.senderObjectId) return;

        this.socket.emit("join room", {
          userId: this.senderObjectId,
          roomId: newId,
        });

        this.fetchMessages().then(() => {
          this.$nextTick(() => this.scrollToBottom());
        });

        this.chatPaused = false;
        this.chatPausedMessage = "";
      },
    },
    methods:{

        changeRoomTopic(newBranchingRoomTopic){
            this.branchingRoomTopic = String(newBranchingRoomTopic);
            this.getAllBranhingRooms();

        },
            openOptionMenu(messageId) {
      this.activeMessageOption = messageId;
    },
        scrollToBottom(){
            const box = this.$refs.messageBox;
            if(box){
                box.scrollTop = box.scrollHeight;
            }

        },
        openMenu() {
            this.isMenuOpen = true;
        },
        closeMenu() {
            this.isMenuOpen = false;
        },

        closeOptionMenu() {
          this.activeMessageOption = null;
          this.showReactionsForMessage = null;
        },


        closeAllOptions(){
        this.closeOptionMenu();
        this.closeMenu();
      },

      async editMessage(msg){
      this.isEditing = true;
      this.selectedMessageId = msg.messageId;
      this.originalEditMessage = msg.Body; 
      this.message = msg.Body;
      this.closeOptionMenu();

    },

        async getAllBranhingRooms(){
            try{

                // Do we create a Local and Global Room, since that would be apropriate
                if(this.branchingRoomTopic === ''){
                    this.branchingRoomTopic = "General";
                }
                const roomTopic = this.branchingRoomTopic 
                const branchingRooms = await Api.get("/branchingrooms", {
                    params:{
                        roomTopic:roomTopic,
                        branchingRoomType:"GlobalRoom"
                    },
                });
                const branchingRoomList= branchingRooms.data.Body;
                let BranchingRoom = null;
                if(branchingRoomList.length>0){
                    BranchingRoom = branchingRooms.data.Body[0];
                }
                console.log(BranchingRoom.branchingRoomId);
                this.branchingRoomId =BranchingRoom ? BranchingRoom.branchingRoomId: '';

                if(this.branchingRoomId){
                    await this.fetchMessages();
                }



            } catch(err){
                console.log(err);
            }
        },
         async replyToMessage(msg) {
            await Api.get(`/branchingrooms/${this.branchingRoomId}/messages/${msg.messageId}`);
            this.parentMessageId = msg.messageId;
            this.replyBannerActive = msg.messageId;
            this.parentMessageContent = msg.Body;
            this.closeOptionMenu();
        },

    async fetchMessages() {
      const res = await Api.get(
        `/branchingrooms/${this.branchingRoomId}/messages`
      );

      this.messages = res.data.map(m => ({
        senderId: m.Sender._id,
        messageId: m.messageId,
        anonymousName: m.anonymousName,
        Body: m.Body,
        timestamp: m.SendTimestamp,
        reactions: m.Reactions || []
      }));
    },

    async sendMessage() {
      if (!this.message.trim() || !this.branchingRoomId) return;

      if (this.isEditing && this.selectedMessageId) {
          try {
            await Api.patch(
              `/branchingrooms/${this.branchingRoomId}/messages/${this.selectedMessageId}`,
              {
                Body: this.message
              }
            );
            
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
        Sender: this.senderObjectId
      };

      if (this.parentMessageId) {
        this.socket.emit("respond to a message", {
          responceMessageData: payload,
          parentMessageId: this.parentMessageId
        });
        this.parentMessageId = '';
      } else {
        this.socket.emit("chat message", payload);
      }

      this.message = '';
      this.replyBannerActive=null;
      this.parentMessageContent='';
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
      const res = await Api.post(
        `/branchingrooms/${this.branchingRoomId}/messages/${messageId}/reactions`,
        {
          reaction,
          userId: this.senderObjectId
        }
      );

      const msg = this.messages.find(m => m.messageId === messageId);
      if (msg) {
        msg.reactions = res.data.reactions || [];
      }

      this.closeOptionMenu();
    },

        goToMain() {
            this.$router.push("/main");
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

.backgroundStyle{
    background-image:linear-gradient(#2b0d2b, #6d2a46);
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
}


.head_banner {
    background-image: linear-gradient(#2b0d2b, #6d2a46);
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 14px 20px;
    align-items: center;
    justify-content: space-between;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    z-index: 1000;
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
    width: 100px;
}

.HeaderFlexBox {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.head_title_style {
    font-size: 30px;
    font-weight: 700;
    color: rgb(249, 249, 249);
    margin: 0;
}

.global-icon {
    width: 35px;  
    height: 40px;
    object-fit: contain;
}

.roomTittle {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}


.categoryDivStyle {
    background-color: #ffecec;
    border-radius: 10px;
    padding: 6px 16px;
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 230px; 
    max-width: 70%;
}


.categoryTitleStyle {
    font-size: 16px;
    margin: 0;
    color: #2b0d2b;
}

.room-box{
    background: linear-gradient(#2b0d2b, #6d2a46);
    flex: 1;
}


.sideMenuOverlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    z-index: 1500;
}


.sideMenuWrapper {
    position: fixed;
    top: 120px;
    right: -360px;
    width: 360px;
    height: calc(100vh - 190px); 
    background: rgba(255, 255, 255, 0.535); 
    backdrop-filter: blur(6px);
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
    padding: 20px;
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
    gap: 18px;
}


.sideMenuButton {
    width: 100%;
    padding: 20px;
    background: linear-gradient(#2b0d2b, #6d2a46);
    border: none;
    border-radius: 16px;
    color: #fff;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s ease;
}

.sideMenuButton:hover {
    opacity: 0.8;
    transform: scale(1.02);
}




.messageBoxFlex {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(#2b0d2b, #6d2a46);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    z-index: 1000;
}

.profileDetailWrapper {
    width: 48px;
    height: 48px;
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
    font-size: 15px;
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


.settingButtonWrapper,
.exitButtonWrapper {
    display: flex;
}

.buttonIconStyle {
    background: transparent;
    border: none;
    cursor: pointer;
}


.room-box{
    overflow-y: scroll;
    background-image:linear-gradient(#2b0d2b, #6d2a46);
    display: flex;
    flex-direction: column;
    padding:80px  12px 90px;
    

}
.messageBox-style {
  padding: 10px 18px;
  max-width: 60%;
  margin: 4px 0;
  border-radius: 10px;
  color: #fdfdfd;
}

.my-message{
  align-self: flex-end;
  background: linear-gradient(#ffc2c2,#936480);
  color: #2b0d2b;
  border-bottom-right-radius: 2px;
}


.others-message {
  align-self: flex-start;
  background: linear-gradient(#1a0c1a, #4f2d3b);
  border-bottom-left-radius: 2px;
}

.message-text-style {
  margin: 0 0 3px 0;
}

.message-font-style {
  font-size: 11px;
  opacity: 0.7;
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

.cancelbuttonInside {
    background: transparent;
    border: none;
    position: absolute;
    right: 80px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
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

.chatPaused {
  background: rgba(0,0,0,0.7);
  color: white;
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
