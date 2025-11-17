const mongoose = require('mongoose');

const globalRoomSchema = new mongoose.Schema(
  { 
    room_Id: { type: String, unique: true, immutable : true},        
    live_Chat: { type: Boolean, required: true},    
    topic_Dropdown: {type :[String], enum:["School", "Food", "Hobbies"], immutable : true},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Global', globalRoomSchema);