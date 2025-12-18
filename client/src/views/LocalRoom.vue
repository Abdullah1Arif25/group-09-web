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
        <div class="room-box" ref="messageBox" @click="closeOptionMenu">


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


                <!--Option Button-->


                <div 
                    class="optionButtonWrapper">
                    <button class="optionButtonStyle" @click.stop="openOptionMenu(msg.messageId)">•••</button>
                </div>

                <!--Option Menu-->
                
                <div 
                    class="optionMenuOverlay"
                    v-if="activeMessageOption === msg.messageId"
                    @click.self="closeOptionMenu()"
                    :class="{ visibleOption: activeMessageOption }">

                    <div class="optionMenuContent" @click.stop>
                        <button class="optionMenuButton" @click="replyToMessage(msg)">Reply</button>
                        <button class="optionMenuButton" @click="reactToMessage(activeMessageOption)">React</button>
                        <button class="optionMenuButton" @click="editMessage(msg)">Edit</button>
                        <button class="optionMenuButton" @click="deleteMessage()">Delete</button>
                    </div>
                </div>

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
                
                <form class="inputContainer" @submit.prevent="sendMessage">
                    <input class ='messageBoxStyle'type="text" v-model="message" placeholder="Send a confession or help a fellow.... "/>
                        <button class="sendbuttonInside" type="submit">
                            <FontAwesomeIcon  icon="paper-plane" size="xl"style="color: #2b0d2b;"  />
                        </button>
                </form>
                
            </div>

            <div class="settingButtonWrapper">
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
            message : '',
            isMenuOpen: false ,
            branchingRoomTopic: '',
            branchingRoomId : '',
            messages:[],
            senderObjectId:getUserObjectId(),
            chatListner: null,
            socket,
            activeMessageOption: null,
            parentMessageId: ''
        };
    },
    beforeUnmount(){
        if(this.socket && this.chatListner){
            this.socket.off("chat message", this.chatListner);
            this.socket.off("respond to a message", this.chatListner);
        }
    },
    async mounted(){
        await this.getAllBranhingRooms();
        await this.scrollToBottom();

        if(!this.socket.connected){
            this.socket.connect();
        }

        this.chatListner = (msg)=>{
            const messageExists = this.messages.some(m => m.messageId === msg.messageId);
            if(messageExists) return;
            this.messages.push({
                senderId: msg.senderObjectId,
                messageId: msg.messageId,
                anonymousName: msg.senderAnonymousName,
                Body: msg.Body,
                timestamp:msg.timestamp

            });
             this.$nextTick(() => {
            this.scrollToBottom();
        });
        };
        this.socket.on("chat message",this.chatListner);
        this.socket.on("respond to a message", this.chatListner);


        if (this.branchingRoomId && this.senderObjectId) {
          this.socket.emit("join room", {
            userId: this.senderObjectId,
            roomId: this.branchingRoomId,
          });
        }

        

    },
    watch: {
         messages() {
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },

        branchingRoomId(newId, oldId) {
        if (!newId || !this.socket || !this.senderObjectId) return;

        this.socket.emit("join room", {
          userId: this.senderObjectId,
          roomId: newId,
        });

        this.fetchMessages().then(() => {
          this.$nextTick(() => this.scrollToBottom());
        });
      },
    },
    methods:{

        changeRoomTopic(newBranchingRoomTopic){
            this.branchingRoomTopic = String(newBranchingRoomTopic);
            this.getAllBranhingRooms();
            this.closeMenu();

        },
        scrollToBottom(){
            const lastMessage = this.$refs.messageBox.lastElementChild;
            if(lastMessage){
                lastMessage.scrollIntoView({ behavior:'smooth'});
            }

        },
        openOptionMenu(messageId){
            this.activeMessageOption=messageId;

        },
        closeOptionMenu(){
            this.activeMessageOption=null;

        },
        openMenu() {
            this.isMenuOpen = true;
        },
        closeMenu() {
            this.isMenuOpen = false;
        },
        exitRoom(){
            this.socket.on("disconnect");
            this.$route.push('/main');

        },
        async replyToMessage(msg){
            const parentMessage = await Api.get(`/branchingrooms/${this.branchingRoomId}/messages/${msg.messageId}`);
            if(!parentMessage){
                console.log("The Message Does not exist");
            }

            this.parentMessageId = msg.messageId;
            this.closeOptionMenu();

        },
        async getAllBranhingRooms(){
            try{

                // Do we create a Local and Global Room, since that would be apropriate
                if(this.branchingRoomTopic === ''){
                    this.branchingRoomTopic = "General";
                }
                const roomTopic = this.branchingRoomTopic 

                const user = JSON.parse(localStorage.getItem("user"));

                const branchingRooms = await Api.get("/branchingrooms", {
                    params:{
                        roomTopic:roomTopic,
                        branchingRoomType:"LocalRoom",
                        language: user.language
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

        async fetchMessages(){
            try{
                const allMessage = await Api.get(`/branchingrooms/${this.branchingRoomId}/messages`);
                this.messages = allMessage.data.map((m)=>({
                    senderId: m.Sender._id,
                    messageId:m.messageId,
                    anonymousName: m.anonymousName,
                    Body: m.Body,timestamp:
                    m.SendTimestamp,

                }));

            } catch(err){
                console.log(err);

            }
        },
        async deleteMessage(){
            try{
                await Api.delete(`/branchingrooms/${this.branchingRoomId}/messages/${this.parentMessageId}`);
                this.parentMessage = '';

            }catch(err){

            }

        },
        async editMessage(msg){

        },

         async sendMessage(){
            try{
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
                const messageId = this.parentMessageId ? `responceMessageId${Math.floor(Math.random() * 100000)}`: `messageId${Math.floor(Math.random() * 100000)}`;
                const  currentTime = new  Date().toISOString();
                const messageData =  {
                    messageId: messageId,
                    Body: this.message,
                    SendTimestamp: currentTime,
                    Reaction: null,
                    ResponseIds: [],
                    Sender: this.senderObjectId
                    

                };

                const payload = {
                    responceMessageData:messageData,
                    parentMessageId:this.parentMessageId
                }
                
                if (this.socket && this.parentMessageId === '') {
                  this.socket.emit("chat message", messageData);
                } else{
                    
                    this.socket.emit("respond to a message", payload);
                     this.parentMessageId = '';
                }

                this.message = '';

            } catch(err){
                console.log(err);
            }
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
    max-width: 60%;
    min-width: 260px;
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
}

/* Message Box (Footer) */
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

.sendbuttonInside {
    background: transparent;
    border: none;
    position: absolute;
    right: 14px;
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

/* Utility Classes */
.settingButtonWrapper,
.exitButtonWrapper {
    display: flex;
}

.buttonIconStyle {
    background: transparent;
    border: none;
    cursor: pointer;
}

.messageBox-style {
    color: #fdfdfd;
}

/* CSS Variables */
:root {
    --header-h: clamp(95px, 15vh, 130px);
    --footer-h: clamp(70px, 10vh, 100px);
}
</style>