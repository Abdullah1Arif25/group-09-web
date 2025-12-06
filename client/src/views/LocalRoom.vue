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
                        {{ branchingRoomCategory || "General"}}
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
                <button class="sideMenuButton">Health</button>
                <button class="sideMenuButton">Education</button>
                <button class="sideMenuButton">Travel</button>
                <button class="sideMenuButton">Movies</button>
                <button class="sideMenuButton">Books</button>
                <button class="sideMenuButton">Sports</button>
                <button class="sideMenuButton">Relationships</button>
                <button class="sideMenuButton">Pets</button>
                <button class="sideMenuButton">Politics</button>
            </div>
        </div>


        <!-- Empty boom -->
        <div class="room_box"></div>

        <!-- Footer and bottom banner -->
        <div class="messageBoxFlex">
            
            <img 
                class="profileDetailWrapper"
                src="@/assets/HMO_logo.png"
                alt="profilePic"
            />

            <div class="messageBoxWrapper">
                <div class="inputContainer">
                <input class ='messageBoxStyle'type="text" id="messageBody" placeholder="Send a confession or help a fellow.... "/>
                <button class="sendbuttonInside" @click="sendMessage">
                    <FontAwesomeIcon  icon="paper-plane" size="xl"style="color: #2b0d2b;"  />
                    </button>
                </div>
            </div>

            <div class="settingButtonWrapper">
            <button class="buttonIconStyle" >
               <FontAwesomeIcon icon="gear" size="2xl"style="color: aliceblue;" />
                </button>
            </div>

            <!-- Exit button -->
            <div class="exitButtonWrapper">
            <button class="buttonIconStyle" >
               <FontAwesomeIcon icon="arrow-right-from-bracket" size="2xl"style="color: aliceblue;" />
                </button>
            </div>

        </div>
    


    </div>
</template>



<script>
import { Api } from '@/Api';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
    name: 'localroom',
    components: {
        FontAwesomeIcon,
    },

    data() {
        return {
            message: '',
            isMenuOpen: false 
        };
    },

    methods: {
        openMenu() {
            this.isMenuOpen = true;
        },
        closeMenu() {
            this.isMenuOpen = false;
        },

        async sendMessage() {
            try {
                var messageBody = document.getElementById("messageBody");
                var messageId = "messageId" + Math.floor(Math.random() * 100000);
                var currentTime = new Date().toISOString();

                const response = await axios.post('http://localhost:3000/api/message', {
                    messageId: messageId,
                    body: messageBody,
                    SendTimestamp: currentTime,
                    Reaction: null,
                    ResponseIds: [],
                    Sender: "{{userObjectId}}",
                    BranchingRoom: "{{branchingRoomObjectId}}"
                });

                this.message = response.object.message;
                console.log("Message Sent");
            } catch (err) {
                console.log(err);
            }
        },
    }
};
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
}

.head_title_style {
    font-size: 30px;
    font-weight: 700;
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
    width: 230px; 
    max-width: 70%;
}


.categoryTitleStyle {
    font-size: 16px;
    margin: 0;
    color: #2b0d2b;
}

.room_box {
    background: linear-gradient(#2b0d2b, #6d2a46);
    flex: 1;
    overflow-y: auto;
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


</style>