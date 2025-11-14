const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  { 
    userId: { type: String, unique: true, immutable : true},        
    personalNumber: { type: String, required: true, unique: true , immutable: true},    
    language: { type: String, default: 'en' },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
