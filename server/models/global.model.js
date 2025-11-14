const mongoose = require('mongoose');

const globalRoomSchema = new mongoose.Schema(
  { 
    room_Id: { type: String, unique: true, immutable : true},        
    live_Chat: { type: Boolean, required: true},    
    topic_Dropdown: { type: String, default: 'general' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Global', globalRoomSchema);