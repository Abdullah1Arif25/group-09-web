const mongoose = require('mongoose');


const LocalRoomSchema  = new mongoose.Schema({
    roomId : {type: String, required: [true, "Name is Required"], unique: true, immutable : true},
    topicDropdown : {type :[String], enum:["School", "Food", "Hobbies"], immutable : true},
    country : {type: String},
    liveChat: {type: Boolean, required: true}



},{timestamp: true});






module.exports =  mongoose.model("LocalRoom", LocalRoomSchema);