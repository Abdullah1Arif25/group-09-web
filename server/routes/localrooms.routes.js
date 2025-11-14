const express = require('express');
const router = express.Router();
const LocalRoom = require("../models/localroom.model");

const LocalRoomRouter = express.Router();



// Create One Local Rooms
LocalRoomRouter.post("/", async (req, res, next)=>{
    try{
        const SingleLocalRooms = await LocalRoom.create(req.body);
        res.status(201).json({message: "Success", Object: SingleLocalRooms})
        next()
    }catch(err){
        res.status(422).json({message: "Not Found", Error_Message: err})
        next(err)
    } 

});


// Read All Local Rooms
LocalRoomRouter.get("/", async (req, res, next)=>{
    try{
        const allRooms = await LocalRoom.find(req.body);
        res.status(200).json(allRooms)
        next()
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err})
        next(err)

    } 

});


// Read One Local Rooms
LocalRoomRouter.get("/:Room_Id", async (req, res, next)=>{
    try{
        const SingleLocalRooms = await LocalRoom.findOne({Room_Id: req.params.Room_Id}, req.body);
        res.status(200).json(SingleLocalRooms)
        next()
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err.message})
        next(err)
    } 

});


// Update One Local Rooms
LocalRoomRouter.patch("/:Room_Id", async (req, res, next)=>{
    try{
        const updatedRoom = await LocalRoom.findOneAndUpdate({Room_Id: req.params.Room_Id}, req.body, {new: true, runValidators: true});
        if(!updatedRoom){res.status(404).json({message: "Not Found"})}
        res.status(200).json(updatedRoom)
        next()
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err})
        next(err)
       
    } 

});


// Delete One Local Rooms
LocalRoomRouter.delete("/:Room_Id", async (req, res)=>{
    try{
        const deletedRoom = await LocalRoom.findOneAndDelete({Room_Id: req.params.Room_Id});
        if(!deletedRoom){ res.status(404).json({message: " Not Found"})}
        res.status(200).json({message: "Successfully Deleted"})
        next()
    }catch(err){
        res.status(404).json({message: "Not Found", Error_Message: err})
        next(err)
    } 

});


module.exports = LocalRoomRouter;


