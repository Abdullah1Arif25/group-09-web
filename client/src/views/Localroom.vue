<template>
    <div class="backgrouncStyle">
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
        <!--Exit Button -->
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
                <input class ='messageBoxStyle'type="text" id="message" v-model="messageVal" placeholder="Send a confession or help a fellow.... "/>
                <button class="sendbuttonInside">
                    <FontAwesomeIcon icon="paper-plane" size="xl"style="color: #2b0d2b;" />
                </button>
            </div>
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';



export default{
    name: 'localroom',
    components:{
        FontAwesomeIcon,
    },
    data(){
        return {
            messageVal : ''
        }
    },
    methods:{
    function(){
        src = "https://kit.fontawesome.com/",
    crossorigin="anonymous"
}

    }
}


</script>

<style>

.backgrouncStyle{
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
.sendButtonWrapper{
    flex:1;
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
}

.categoryTitleStyle{
    font-weight: 400;
    font-size:medium;
    color: #2b0d2b;
    align-items: center;


}
.messageBoxStyle{
    width: 70%;
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
    right: 15%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}



</style>