const express = require("express");
const BranchingRoom = require("../models/branchingroom.model");
const messagesModel = require("../models/message.model");
const branchingroomModel = require("../models/branchingroom.model");
const branchingRoomRoute  = express.Router();
const branchingRoomController = require('../controllers/branchingrooms.controller');



// Create One Brancing Rooms
branchingRoomRoute.post("/", branchingRoomController.createBranchingRoom);

// POST /branchingroom/:branchingroomId/message
branchingRoomRoute.post("/:branchingRoomId/messages", branchingRoomController.createMessageInABranchingRoom);

// GET: Read All Branching Rooms
branchingRoomRoute.get("/", branchingRoomController.getAllBranchingRooms);

// GET: Read One Branching Rooms SuperType
branchingRoomRoute.get("/:branchingRoomId", branchingRoomController.getBranchingRoom);

// GET: All Messages belonging to a branching room
branchingRoomRoute.get("/:branchingRoomId/messages", branchingRoomController.getAllMessagesInBranchingRoom);

// GET: Specific Message from a specific branching room
branchingRoomRoute.get("/:branchingRoomId/messages/:messageId",branchingRoomController.getAMessageInABranchingRoom);

// PATCH: Update One Branhing Room
branchingRoomRoute.patch("/:branchingRoomId", branchingRoomController.updateBranchingRoomTopic);

// PATCH: Edit a specific message, reaction, response
branchingRoomRoute.patch("/:branchingRoomId/messages/:messageId", branchingRoomController.updateMessageInBranchingRoom);


// DELETE:  One Branching Room
branchingRoomRoute.delete("/:branchingRoomId", branchingRoomController.deleteBranchingRoom);

// DELETE: All Branching Room Collection
branchingRoomRoute.delete("/", branchingRoomController.deleteAllBranchingRooms);

// DELETE: A specific message in a specific branching room
branchingRoomRoute.delete("/:branchingRoomId/messages/:messageId", branchingRoomController.deleteMessageInBranchingRoom);

module.exports = branchingRoomRoute;


