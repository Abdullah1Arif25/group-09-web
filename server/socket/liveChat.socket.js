const { generateAnonymousName, deleteAnonymousName } = require("../services/anonymousNames.services");
require("dotenv").config();
const {createMessageInABranchingRoom} = require("../services/createMessageInBranchingRoom.services");
const {responceToMessageInABranchingRoom} = require("../services/responceToMessageInABranchingRoom.services");
const {reactToMessageInBranchingRoom} = require("../services/reactToMessageInBranchingRoom.services");



module.exports = function (io) {

    io.on("connection", (socket) => {

        console.log("new Connection: ",socket.id);

        // Initialize variables
        socket.anonymousNames = new Map();
        socket.roomId = null;
        socket.userId = null;    
        socket.currentRoom = null;

        socket.on("admin chat toggle", ({ roomType, live }) => {
            io.emit("chat status changed", {
                roomType,
                live
            });
        });
        
        // user joins room
        socket.on("join room", async (data) => {
            
            
            const { userId, roomId } = data;
            console.log("➡ join room:", { socketId: socket.id, userId, roomId });

            try {
                socket.roomId = roomId;
                socket.userId = userId;

                // leave previous room
                if (socket.currentRoom) {
                    const prevName = socket.anonymousNames.get(socket.currentRoom);
                    if (prevName) deleteAnonymousName(prevName);
                    socket.leave(socket.currentRoom);
                    socket.anonymousNames.delete(socket.currentRoom);
                }

                socket.join(roomId);
                socket.currentRoom = roomId;

                const name = generateAnonymousName();
                socket.anonymousNames.set(roomId, name);

            } catch (err) {
                console.log("Join room error:", err);
            }
        });

        // user sends message
        socket.on("chat message", async (messageData) => {
            if (!socket.currentRoom) 
                return;

            try {

                const name = socket.anonymousNames.get(socket.currentRoom);
                const messageBody = await createMessageInABranchingRoom(socket.currentRoom, name, messageData);
              
                console.log("Saved message:", messageBody);

                io.to(socket.currentRoom).emit("chat message", {
                    senderAnonymousName: name,
                    ParentMessageId: messageBody.ParentMessageId || '',
                    messageId: messageBody.messageId,
                    Reactions: messageBody.Reactions,
                    senderObjectId: messageBody.Sender,
                    Body: messageBody.Body,
                    timestamp:messageBody.SendTimestamp
                });

            } catch (err) {
                if (err.message === "chatPaused") {
                    socket.emit("chat paused", {
                        message: "Chat is currently paused."
                });
                } else {
                    console.log("Send message error:", err);
                }
            }
        });
        // user reacts to a message
        socket.on("react to message", async (payload) =>{
            if(!socket.currentRoom) return;

            try{
                const name = socket.anonymousNames.get(socket.currentRoom);
                const updatedMessage = await reactToMessageInBranchingRoom(payload);
                console.log("updated message:", updatedMessage);

                io.to(socket.currentRoom).emit("react to message", {
                    senderAnonymousName: name,
                    ParentMessageId: updatedMessage.ParentMessageId,
                    messageId: updatedMessage.messageId,
                    Reactions: updatedMessage.Reactions,
                    senderObjectId: updatedMessage.Sender,
                    Body: updatedMessage.Body,
                    timestamp:updatedMessage.SendTimestamp
                });

            } catch(err){
                console.log("Send message error:", err);
            }
        })

        // user respond to a  message
        socket.on("respond to a message", async (payload) => {
            const {responceMessageData, parentMessageId} = payload;
            if (!socket.currentRoom) 
                return;

            try {
                const name = socket.anonymousNames.get(socket.currentRoom);
                const messageBody = await responceToMessageInABranchingRoom(socket.currentRoom, name, responceMessageData, parentMessageId);
                const parentMessageBody = messageBody.ParentMessageId;
              
                console.log("Saved message:", messageBody);

                io.to(socket.currentRoom).emit("respond to a message", {
                    senderAnonymousName: name,
                    ParentMessageId: { Body: parentMessageBody.Body,
                         messageId: parentMessageBody.messageId,
                         messageObjectId: parentMessageBody._id},
                    messageId: messageBody.messageId,
                    senderObjectId: messageBody.Sender,
                    Reactions: messageBody.Reactions,
                    Body: messageBody.Body,
                    timestamp:messageBody.SendTimestamp
                });

            } catch (err) {
                console.log("Send message error:", err);
            }
        });

        // user disconnects
        socket.on("disconnect", () => {
           for (const name of socket.anonymousNames.values()) {
            deleteAnonymousName(name);
        }
        });
    });
}