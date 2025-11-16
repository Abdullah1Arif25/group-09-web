const express = require("express");
const BranchingRoom = require("../models/branchingroom.model");
const branchingRoomRoute  = express.Router();



// Create One Brancing Rooms
branchingRoomRoute.post("/", async (req, res, next)=>{
    try{
        const SingleBrancingRooms = await BranchingRoom.create(req.body);
        res.status(201).json({message: "Success", Object: SingleBrancingRooms})
        next()
    }catch(err){
        res.status(422).json({message: "Not Found", Error_Message: err})
        next(err)
    } 

});


// Read All Branching Rooms
branchingRoomRoute.get("/", async (req, res, next)=>{
    try{
        const allBrancingRooms = await BranchingRoom.find(req.body);
        res.status(200).json(allRooms)
        next()
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err})
        next(err)

    } 

});


// Read Branching Room By Id
branchingRoomRoute.get("/:branching_room_id", async (req, res, next)=>{
    try{
        const SingleBranchingRooms = await BranchingRoom.findOne({Branching_Branching_Room_Id: req.params.Branching_Branching_Room_Id});
        res.status(200).json(SingleBranchingRooms)
        next()
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err.message})
        next(err)
    } 

});

// Read One Branching Rooms SuperType
branchingRoomRoute.get("/:branching_room_id", async (req, res, next)=>{
    try{
        const SingleBranchingRooms = await BranchingRoom.findOne({Branching_Branching_Room_Id: req.params.Branching_Branching_Room_Id}).populate("Room_type");
        res.status(200).json(SingleBranchingRooms)
        next()
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err.message})
        next(err)
    } 

});


// Update One Branhing Room
branchingRoomRoute.patch("/:branching_room_id", async (req, res, next)=>{
    try{
        const updatedRoom = await BranchingRoom.findOneAndUpdate({Branching_Branching_Room_Id: req.params.Branching_Branching_Room_Id}, req.body, {new: true, runValidators: true});
        if(!updatedRoom){res.status(404).json({message: "Not Found"})}
        res.status(200).json(SingleBranchingRooms)
        next()
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err})
        next(err)
       
    } 

});


// Delete One Branching Room
branchingRoomRoute.delete("/:branching_room_id", async (req, res)=>{
    try{
        const deletedRoom = await BranchingRoom.findOneAndDelete({Branching_Room_Id: req.params.Branching_Room_Id});
        if(!deletedRoom){ res.status(404).json({message: " Not Found"})}
        res.status(200).json({message: "Successfully Deleted"})
        next()
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err})
        next(err)
    } 

});


module.export = branchingRoomRoute;


