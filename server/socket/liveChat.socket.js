const { generateAnonymousName, deleteAnonymousName } = require("../services/anonymousNames.services");
require("dotenv").config();
const {createMessageInABranchingRoom} = require("../services/createMessageInBranchingRoom.services");
const {responceToMessageInABranchingRoom} = require("../services/responceToMessageInABranchingRoom.services");




module.exports = function (io) {

    io.on("connection", (socket) => {

        console.log("new Connection: ",socket.id);

        // Initialize variables
        socket.anonymousName = generateAnonymousName();
        socket.roomId = null;
        socket.userId = null;    
        socket.currentRoom = null;

        // user joins room
        socket.on("join room", async (data) => {
            const { userId, roomId } = data;
            
            if (!allowed) {
                socket.emit("chat-frozen");
                return;
            }

            console.log("➡ join room:", { socketId: socket.id, userId, roomId });

            try {
                socket.roomId = roomId;
                socket.userId = userId;

                // leave previous room
                if (socket.currentRoom) {
                    socket.leave(socket.currentRoom);
                }

                socket.join(roomId);
                socket.currentRoom = roomId;

                // notifies users in the room
                io.to(roomId).emit("chat message", {
                    text: `${socket.anonymousName} joined the room.`,
                    timestamp: new Date()
                });

            } catch (err) {
                console.log("Join room error:", err);
            }
        });

        // user sends message
        socket.on("chat message", async (messageData) => {
            if (!allowed) {
                socket.emit("chat-frozen");
                return;
            }

            if (!socket.roomId) 
                return;

            try {
                const messageBody = await createMessageInABranchingRoom(socket.roomId, socket.anonymousName, messageData);
              
                console.log("Saved message:", messageBody);

                io.to(socket.currentRoom).emit("chat message", {
                    senderAnonymousName: socket.anonymousName,
                    messageId: messageBody.messageId,
                    senderObjectId: messageBody.Sender,
                    Body: messageBody.Body,
                    timestamp:messageBody.SendTimestamp
                });

            } catch (err) {
                console.log("Send message error:", err);
            }
        });

        // user sends message
        socket.on("respond to a message", async (payload) => {
            if (!socket.roomId) 
                return;

            try {
                const{responceMessageData, parentMessageId} = payload;
                const messageBody = await responceToMessageInABranchingRoom(socket.roomId, socket.anonymousName, responceMessageData, parentMessageId);
              
                console.log("Saved message:", messageBody);

                io.to(socket.currentRoom).emit("respond to a message", {
                    senderAnonymousName: socket.anonymousName,
                    parentMessageId,
                    messageId: messageBody.messageId,
                    senderObjectId: messageBody.Sender._id,
                    Body: messageBody.Body,
                    timestamp:messageBody.SendTimestamp
                });

            } catch (err) {
                console.log("Send message error:", err);
            }
        });

        // user disconnects
        socket.on("disconnect", () => {
            deleteAnonymousName(socket.anonymousName);
        });
    });
};
