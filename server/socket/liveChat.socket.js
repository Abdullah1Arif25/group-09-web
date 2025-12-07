const { generateAnonymousName, deleteAnonymousName } = require("../services/anonymousNames.services");

module.exports = function (io) {

    io.on("connection", (socket) => {

        // Initialize variables
        socket.anonymousName = generateAnonymousName();
        socket.userId = null;
        socket.roomId = null;
        socket.currentRoom = null;

        // user joins room
        socket.on("join room", async (data) => {
            const { userId, roomId } = data;

            try {
                const response = await fetch("http://localhost:3000/api/branchingrooms/join", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({userId: userId,roomId: roomId})
                });

                if (response.status !== 200) 
                    return;

                const result = await response.json();

                socket.userId = result.userObjectId;
                socket.roomId = result.roomObjectId;

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
        socket.on("chat message", async (text) => {
            if (!socket.userId || !socket.roomId) 
                return;

            try {
                await fetch("http://localhost:3000/api/messages", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        Body: text,
                        Sender: socket.userId,
                        BranchingRoom: socket.roomId
                    })
                });

                io.to(socket.currentRoom).emit("chat message", {
                    sender: socket.anonymousName,
                    text,
                    timestamp: new Date()
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
