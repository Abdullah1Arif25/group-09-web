<template>
    <div class="backgroundStyle">
        <!--Head Banner -->
        <div 
            class="head_banner"
            >
            <div class="logoWrapper">
                <img 
                  class="logo" 
                  src="@/assets/HMO_logo.png"
                  alt="App Logo"
                />
            </div>
            

        <!-- Local Room Title and Branching Room Type -->
        <div class="HeaderFlexBox">
           
            <h1 class="head_title_style">LOCAL ROOM</h1>
                <div class="categoryDivStyle">
                    <h2 class="categoryTitleStyle">
                        {{ branchingRoomCategory || "General"}}
                    </h2>
                </div>
        </div>
        <!--Menu Button -->
        <div class="MenuButtonFlex">
            <button class="buttonIconStyle" >
               <FontAwesomeIcon icon="list-ul" size="2xl"style="color: aliceblue;" />
            </button>
        </div>
    </div>


    <div class="room_box">

    </div>
    
    
    <br></br>

    <!--Footer for Message Box and related Functionality-->
    <div class= "messageBoxFlex">
        <img 
            class = "profileDetailWrapper"
            src="@/assets/HMO_logo.png"
            alt="profilePic"/>

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

            <!--Exit Button -->
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



export default{
    name: 'localroom',
    components:{
        FontAwesomeIcon,
    },
    data(){
        return {
            message : ''
        }
    },
    methods:{
         async sendMessage(){
            try{
                var messageBody = document.getElementById("messageBody");
                var messageId = "messageId" + Math.floor(Math.random *100000);
                var currentTime = new  Date().toISOString();
                const responce = await axios.post('http://localhost:3000/api/message', {
                    messageId: messageId,
                    body: messageBody,
                    SendTimestamp: currentTime,
                    Reaction: null,
                    ResponseIds: [],
                    Sender: "{{userObjectId}}",
                    BranchingRoom: "{{branchingRoomObjectId}}"

                });
                this.message = responce.object.message;
                console.log("Message Send")
            } catch(err){
                console.log(err);
            }
        },
        
    function(){
        src = "https://kit.fontawesome.com/",
    crossorigin="anonymous"
}

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
.head_title_style{
    font-weight: 600;
    font-size: large;
    color: rgb(249, 249, 249);


}
.logo {
  width: 150px;
  
}
.profileDetailWrapper{
    width: 12%;
    height: 12%;
    border-radius: 1000px;
      object-fit: cover; 
    flex:0 0 auto;
}
.sendMessageButtonStyle{
    height: 10%;
    
}
.exitButtonWrapper{
    margin-left: 16px;
}
.sendButtonWrapper,.settingButtonWrapper{
    flex:0 auto 1;
    display:flex;
}
.head_banner{
    background-image:linear-gradient(#2b0d2b, #6d2a46);
    display: flex;
    position:fixed;
    top:30px;
    left: 0px;
    right: 0px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;

}
.logoWrapper,.MenuButtonFlex{
    flex:1;
    display: flex;
    align-items: center;
}

.logoWrapper{
    justify-content: flex-start;
}

.MenuButtonFlex{
    justify-content: flex-end;
}
.HeaderFlexBox{
    align-items: center;
    display: flex;
    flex-direction: column;

}
.room_box{
    overflow-y: scroll;
    background-image:linear-gradient(#2b0d2b, #6d2a46);
    

}
.messageBoxFlex{
    background-image:linear-gradient(#2b0d2b, #6d2a46);
    position:fixed;
    bottom: 0px;
    left:0px;
    width:100%;

    display: flex;
    padding:8px 12px;
    align-items: center;
    flex-direction: row;

    
}

.messageBoxWrapper {
  flex: 1;
  display: flex;
  justify-content: center; 

}
.categoryDivStyle{
    background-color: #ffecec;
    border-radius: 10px;
    padding-top: 5px;
    width: 100%;
    display: flex;
        align-items: center;
    justify-content: center;

}

.categoryTitleStyle{
    font-weight: 50%;
    font-size:large;
    color: #2b0d2b;


}
.messageBoxStyle{
    width: 80%;
    border-radius: 10px;
    padding-right: 45px;
    height: 40px;
    padding-left: 12px;
    border: none;

}
.buttonIconStyle{
    background: transparent;
    border: none;
}
.inputContainer{
    position: relative;
    width: 100%;
    
}

.sendbuttonInside{
    background: transparent;
    border: none;
    position: absolute;
    right: 20%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}



</style>