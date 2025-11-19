const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  messageId: { type: String, unique: true, required: true, immutable: true, index:true },
  Body: {type: String, required: true },
  SendTimestamp: { type: Date }, 
  Reaction: { type: String, 
    enum: ['👍', '❤️', '😂', '😢', '😡', null] 
  }, 
  ResponseIds: [{ type: mongoose.Schema.ObjectId, ref: 'messages', required: false }], 
  //Foreign key Refferences
  Sender: { type: Schema.Types.ObjectId, ref: 'User' }, 
  BranchingRoom: { type: Schema.Types.ObjectId, ref: 'branchingRoom' }
}); 

module.exports = mongoose.model('messages', messageSchema);