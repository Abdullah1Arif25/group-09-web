const mongoose = require('mongoose');


const LocalRoomSchema  = new mongoose.Schema({
    Room_Id : {type: String, required: [true, "Name is Required"], unique: true, immutable : true},
    Topic_Dropdown : {type :[String], enum:["School", "Food", "Hobbies"], immutable : true},
    Live_Chat: {type: [String]}



},{timestamp: true});






module.exports =  mongoose.model("LocalRoom", LocalRoomSchema);