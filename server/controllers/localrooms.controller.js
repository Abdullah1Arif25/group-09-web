const express = require('express');
const LocalRoom = require("../models/localroom.model");
const LocalRoomRouter = express.Router();



// Create One Local Rooms
const createLocalRoom = async function(req, res, next){
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

};


// GET: Read All Local Rooms
const getAllUser = async function(req, res, next){
    try{
        const allRooms = await LocalRoom.find(req.body);
        res.status(200).json(allRooms);
    }catch(err){
        next(err);

    } 
};


// Read One Local Rooms
const getALocalRoom =  async function(req, res, next){
    try{
        const SingleLocalRooms = await LocalRoom.findOne({roomId: req.params.roomId}, req.body);
        res.status(200).json(SingleLocalRooms);
    }catch(err){
        next(err);
    } 

};


// Update One Local Room
const updateLocalRoom =  async function(req, res, next){
    try{
        const { country, liveChat } = req.body;
        if (!country) {
            return res.status(400).json({ message: "Country is required." });
        }

        if (liveChat === undefined) {
            return res.status(400).json({ message: "live Chat is required." });
        }

        const updatedRoom = await LocalRoom.findOneAndUpdate({ roomId: req.params.roomId },{ country, liveChat },{ new: true, runValidators: true });
        
        if (!updatedRoom) {
            return res.status(404).json({ message: "Local room not found." });
        } 
        
        return res.status(200).json({ message: "Success"});

    }   catch (err) {
        next(err);
  }
};

// Delete One Local Rooms
const deleteLocalRoomById = async function(req, res, next){
    try{
        const deletedRoom = await LocalRoom.findOneAndDelete({roomId: req.params.roomId});
        res.status(200).json({message: "Successfully Deleted"});
    }catch(err){
        next(err)
    } 

};

module.exports = {createLocalRoom, deleteLocalRoomById, getALocalRoom, getAllUser, updateLocalRoom};


