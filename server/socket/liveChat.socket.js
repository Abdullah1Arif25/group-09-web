const { generateAnonymousName, deleteAnonymousName } = require("../services/anonymousNames.services");

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
            if (!socket.roomId) 
                return;

            try {
                const responce = await fetch(`http://localhost:3000/api/v1/branchingrooms/${socket.roomId}/messages`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        messageId: messageData.messageId,
                        Body: messageData.Body,
                        SendTimestamp: messageData.SendTimestamp,
                        Reaction: messageData.Reaction,
                        ResponseIds: messageData.ResponseIds,
                        Sender: messageData.Sender,
                        anonymousName : socket.anonymousName
                    })
                });
                const messageBody = await responce.json();
                console.log("Saved message:", messageBody.Object);

                io.to(socket.currentRoom).emit("chat message", {
                    sender: socket.anonymousName,
                  
                    senderObjectId: messageBody.Object.Sender,
                    Body: messageBody.Object.Body,
                    timestamp:messageBody.Object.SendTimestamp
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
