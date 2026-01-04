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
 
        // user disconnects
        socket.on("disconnect", () => {
           for (const name of socket.anonymousNames.values()) {
            deleteAnonymousName(name);
        }
        });
    });
}