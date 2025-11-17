const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  MessageId: { type: String },
  SendTimestamp: { type: Date },
  Reaction: { type: String },
  ResponseIds: { type: [Number] },
  UserId: { type: String }
});

module.exports = mongoose.model('messages', messageSchema);