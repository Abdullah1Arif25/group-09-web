const express = require('express');
const LocalRoom = require("../models/localroom.model");
const LocalRoomRouter = express.Router();



// Create One Local Rooms
LocalRoomRouter.post("/", async (req, res, next)=>{
    try{
        const localRoomsCount = await LocalRoom.estimatedDocumentCount();
        if(localRoomsCount>0){
            return res.status(409).json({message:"Entity already exists"});
        }
        const SingleBranchingRoom = await LocalRoom.create(req.body);
        res.status(201).json({message: "Success", Object: SingleLocalRooms});
    }catch(err){
        if(err.code===11000){
            res.status(409).json({
                message: "Entity Already Exists",
                
            });
        }
    } 

});


// Read All Local Rooms
LocalRoomRouter.get("/", async (req, res, next)=>{
    try{
        const allRooms = await LocalRoom.find(req.body);
        res.status(200).json(allRooms);
        next();
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err});
        next(err);

    } 

});


// Read One Local Rooms
LocalRoomRouter.get("/:roomId", async (req, res, next)=>{
    try{
        const SingleLocalRooms = await LocalRoom.findOne({roomId: req.params.roomId}, req.body);
        res.status(200).json(SingleLocalRooms);
        next();
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err.message});
        next(err);
    } 

});


// Update One Local Rooms
LocalRoomRouter.patch("/:roomId", async (req, res, next)=>{
    try{
        const updatedRoom = await LocalRoom.findOneAndUpdate({roomId: req.params.roomId}, req.body, {new: true, runValidators: true});
        if(!updatedRoom){res.status(404).json({message: "Not Found"})}
        res.status(200).json(updatedRoom)
        next();
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err});
        next(err);
       
    } 

});


// Delete One Local Rooms
LocalRoomRouter.delete("/:roomId", async (req, res)=>{
    try{
        const deletedRoom = await LocalRoom.findOneAndDelete({roomId: req.params.roomId});
        res.status(200).json({message: "Successfully Deleted"});
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err});
        next(err)
    } 

});


module.exports = LocalRoomRouter;


