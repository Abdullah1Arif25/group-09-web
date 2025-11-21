const express = require('express');
const LocalRoom = require("../models/localroom.model");
const LocalRoomRouter = express.Router();
const localRoomController = require('../controllers/localrooms.controller');



// Create One Local Rooms
LocalRoomRouter.post("/",localRoomController.createLocalRoom );


// Read All Local Rooms
LocalRoomRouter.get("/", localRoomController.getAllUser);


// Read One Local Rooms
LocalRoomRouter.get("/:roomId", localRoomController.getALocalRoom);


// Update One Local Rooms
LocalRoomRouter.patch("/:roomId", localRoomController.updateLocalRoomById);


// Delete One Local Rooms
LocalRoomRouter.delete("/:roomId", localRoomController.deleteLocalRoomById);


module.exports = LocalRoomRouter;


