const express = require("express");
const BranchingRoom = require("../models/branchingroom.model");
const branchingRoomRoute  = express.Router();



// Create One Brancing Rooms
branchingRoomRoute.post("/", async (req, res, next)=>{
    try{
        const SingleBrancingRooms = await BranchingRoom.create(req.body);
        const BrancingRooms = await SingleBrancingRooms.find(SingleBrancingRooms.parentRoomId).populate("parentRoomId");

        res.status(201).json({message: "Success", Object: BrancingRooms});
        next();
    }catch(err){
        res.status(422).json({message: "Not Found", Error_Message: err});
        next(err);
    } 

});


// Read All Branching Rooms
branchingRoomRoute.get("/", async (req, res, next)=>{
    try{
        const allBrancingRooms = await BranchingRoom.find(req.body);
        res.status(200).json(allBrancingRooms);
               
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err});
        

    } 

});


// Read Branching Room By Id
branchingRoomRoute.get("/:branchingRoomId", async (req, res)=>{
    try{
        const SingleBranchingRoom = await BranchingRoom.findOne({branchingRoomId: req.params.branchingRoomId}).populate("parentRoomId");
        if (!SingleBranchingRoom) {
            return res.status(404).json({ message: "Branching room not found" });
    }
        res.status(200).json(SingleBranchingRoom);
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err.message});

    } 

});

// Read One Branching Rooms SuperType
branchingRoomRoute.get("/:branchingRoomId", async (req, res, next)=>{
    try{
        const SingleBranchingRooms = await BranchingRoom.findOne({branchingRoomId: req.params.branchingRoomId}).populate("parentRoomId").exec();
        res.status(200).json(SingleBranchingRooms);
    
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err.message});
    
    } 

});


// Update One Branhing Room
branchingRoomRoute.patch("/:branchingRoomId", async (req, res, next)=>{
    try{
        const updatedRoom = await BranchingRoom.findOneAndUpdate({branchingRoomId: req.params.branchingRoomId}, req.body, {new: true, runValidators: true});
        if(!updatedRoom){res.status(404).json({message: "Not Found"});}
        res.status(200).json(SingleBranchingRooms);
        next();
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err});
        next(err);
       
    } 

});


// Delete One Branching Room
branchingRoomRoute.delete("/:branchingRoomId", async (req, res)=>{
    try{
        const deletedRoom = await BranchingRoom.findOneAndDelete({branchingRoomId: req.params.branchingRoomId});
        if(!deletedRoom){ res.status(404).json({message: " Not Found"})}
        res.status(200).json({message: "Successfully Deleted"});
        next();
    }catch(err){
        res.status(404).json({message: "Not Found", "Error_Message": err});
        next(err);
    } 

});


module.exports = branchingRoomRoute;


