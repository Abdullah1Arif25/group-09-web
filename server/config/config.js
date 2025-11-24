// basic configuration
const config = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hmoDB'
  };
  
  module.exports = config;
  