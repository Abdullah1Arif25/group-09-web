const mongoose = require('mongoose');
const { mongoURI } = require('./config'); 

function connectDB() {
  return mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = connectDB;
