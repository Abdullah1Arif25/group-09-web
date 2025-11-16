const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  { 
    userId: { type: String, unique: true, immutable : true},        
    personalNumber: { type: String, required: true, unique: true , 
      immutable: true, 
      match: [/^\d{10}$/, 'Personal number must be exactly 10 digits']},    
    language: { type: String, default: 'en' },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
