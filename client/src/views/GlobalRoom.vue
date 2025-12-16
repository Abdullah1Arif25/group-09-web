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
                <input class ='messageBoxStyle' type="text" v-model="message" placeholder="Send a confession or help a fellow.... "/>
                <button class="sendbuttonInside" @click="sendMessage">
                    <FontAwesomeIcon  icon="paper-plane" size="xl" style="color: #2b0d2b;"  />
                    </button>
                </div>
            </div>

            <div class="settingButtonWrapper">
            <button class="buttonIconStyle" >
               <FontAwesomeIcon icon="gear" size="2xl" style="color: aliceblue;" />
                </button>
            </div>

            <!-- Exit button -->
            <div class="exitButtonWrapper">
            <button class="buttonIconStyle" >
               <FontAwesomeIcon icon="arrow-right-from-bracket" size="2xl" style="color: aliceblue;" />
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
    name: 'globalroom',
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
        };
    },
    beforeUnmount(){
        if(this.socket && this.chatListner){
            this.socket.off("chat message", this.chatListner);
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
      },
    },
    methods:{

        changeRoomTopic(newBranchingRoomTopic){
            this.branchingRoomTopic = String(newBranchingRoomTopic);
            this.getAllBranhingRooms();

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


</style>

