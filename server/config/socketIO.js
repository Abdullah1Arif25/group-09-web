const { Server } = require("socket.io");

module.exports = function setupSocket(httpServer,app) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.set("io", io);

  // load live chat logic
  require("../socket/liveChat.socket")(io);

  console.log("Socket running.");

  return io;
};