const mongoose = require('mongoose');


const LocalRoomSchema  = new mongoose.Schema({
    roomId : {type: String, required: [true, "Id is Required"], unique: true, immutable : true},
    topicDropdown : {type :[String], enum:["General","School", "Food", "Hobbies"], immutable : true, default: "General"},
    country : {type: String},
    liveChat: {type: Boolean, required: true}



},{timestamp: true});






module.exports =  mongoose.model("LocalRoom", LocalRoomSchema);