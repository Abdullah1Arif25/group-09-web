const { Server } = require("socket.io");

module.exports = function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*"
    }
  });

  app.set("io", io);

  // load live chat logic
  require("../socket/liveChat.socket")(io);

  console.log("Socket running.");
};