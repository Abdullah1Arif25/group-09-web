const express = require("express");
const BranchingRoom = require("../models/branchingroom.model");
const messagesModel = require("../models/message.model");




// POST:  Create One Brancing Rooms
const createBranchingRoom = async function(req, res, next){
    try{
        const SingleBrancingRooms = await BranchingRoom.create(req.body);
        res.status(201).json({message: "Success", Object: SingleBrancingRooms});
    }catch(err){
        next(err);
    } 

};

// POST:  Create A message in a specific Branching Room
const createMessageInABranchingRoom = async function(req, res, next){
    try{
        const branchingRoom = await BranchingRoom.findOne({branchingRoomId: req.params.branchingRoomId});        
        if(!branchingRoom){ return res.status(409).json({message:"The Branching Room Doesnot exsists"});}
        const branchingRoomObjectId = branchingRoom._id;

        const newMessage = await messagesModel.create({BranchingRoom: branchingRoomObjectId, ...req.body});
        res.status(201).json({message: "Success"});

    }catch (err){
        next(err);
    }

};

// GET: Read All Branching Rooms
const getAllBranchingRooms = async function(req, res, next){
    try{
        //Filter
        const queryParams = {};
        if(req.query.branchingRoomType !== undefined) queryParams.branchingRoomType = req.query.branchingRoomType;
        if(req.query.roomTopic !== undefined) queryParams.roomTopic = req.query.roomTopic;

        let query = BranchingRoom.find(queryParams);


        //Sorting
        if(req.query.sort){
            const sortby = req.query.sort.split(",").join(" ");
            query = query.sort(sortby);
        } else{
            query = query.sort("-createdAt");
        }

        //Field Selection

        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }


        // Pagination

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page -1)*limit;
        
        query = query.skip(skip).limit(limit);


        const allBrancingRooms = await query;
        res.status(200).json({
            status: "Success", 
            results : allBrancingRooms.length,
            limit: limit,
            pages: page, 
            Body: allBrancingRooms

        });  
    }catch(err){
        next(err);
    } 
};

// GET: Read One Branching Rooms SuperType
const getBranchingRoom =  async function(req, res, next){
    try{
        const SingleBranchingRooms = await BranchingRoom.findOne({branchingRoomId: req.params.branchingRoomId}).populate("parentRoomId").exec();
        res.status(200).json(SingleBranchingRooms);
    }catch(err){
        next(err);
    } 

};

// GET:  Read All messages in a branching room
const getAllMessagesInBranchingRoom  = async function(req, res, next) {
    try{
        const branchingRoom = await BranchingRoom.findOne({branchingRoomId: req.params.branchingRoomId});
        const allmessagesModelInBranchingRoom = await messagesModel.find({BranchingRoom: branchingRoom._id}).populate("BranchingRoom").populate("ResponseIds").populate("Sender");
        if(!allmessagesModelInBranchingRoom){ res.status(404).json({message:"Not Found"});}
        res.status(200).json(allmessagesModelInBranchingRoom);

    }catch (err){
        next(err);
    }

};

// GET: Read A specific message in a specific branching room 
const getAMessageInABranchingRoom =  async function(req, res, next){
    try{
        const branchingRoom = await BranchingRoom.findOne({branchingRoomId: req.params.branchingRoomId});
        const allmessagesModelInBranchingRoom = await messagesModel.find({BranchingRoom: branchingRoom._id});
        const MessageInBranchingRoom = await messagesModel.findOne({messageId: req.params.messageId});
        if(!allmessagesModelInBranchingRoom){ res.status(404).json({message:"Not Found"});}
        res.status(200).json(MessageInBranchingRoom);

    }catch (err){
        next(err);
    }

};



// Update One Branhing Room
const updateBranchingRoomTopic = async function(req, res, next){
    try{
        const updatedRoom = await BranchingRoom.findOneAndUpdate({
            branchingRoomId: req.params.branchingRoomId},
            {$set:{
                roomTopic: req.body.roomTopic
            }
            }, 
            {new: true, runValidators: true});

        if(!updatedRoom){res.status(404).json({message: "Not Found"});}
        res.status(200).json(updatedRoom);
  
    }catch(err){
        next(err); 
    } 
};


// PATCH /branchingroom/:branchingroomId/message
const updateMessageInBranchingRoom = async function(req, res, next){
    try{
        const branchingRoom = await BranchingRoom.findOne({branchingRoomId: req.params.branchingRoomId});        
        if(!branchingRoom){ return res.status(409).json({message:"The Branching Room Doesnot exsists"});}
        const branchingRoomObjectId = branchingRoom._id;

        const updates = {};

        if(req.body.Reaction!== undefined) updates.Reaction = req.body.Reaction; 
        if(req.body.Body!== undefined) updates.Body = req.body.Body; 

        const updatedMessage = await messagesModel.findOneAndUpdate({
            BranchingRoom: branchingRoomObjectId, 
            messageId: req.params.messageId},
        {$set: updates});
        res.status(200).json({message: "Success", object: updatedMessage});
    }catch (err){
        next(err);
    }

};


// Delete One Branching Room
const deleteBranchingRoom = async function(req, res, next){
    try{
        const deletedRoom = await BranchingRoom.findOneAndDelete({branchingRoomId: req.params.branchingRoomId});
        if(!deletedRoom){ res.status(404).json({message: " Not Found"})}
        res.status(200).json({message: "Successfully Deleted"});
    }catch(err){
        next(err);
    } 

};

// Delete Branching Room Collection
const deleteAllBranchingRooms =  async function(req, res, next){
    try{
        const deletedRoom = await BranchingRoom.deleteMany();
        res.status(200).json({message: "Successfully Deleted all Collections"});
    }catch(err){
        next(err);
    } 

};

// DELETE: Delete A Specific Message In A Branching Room 
const deleteMessageInBranchingRoom = async function(req, res, next){
    try{
        const branchingRoom = await BranchingRoom.findOne({branchingRoomId: req.params.branchingRoomId});
        if(!branchingRoom){ return res.status(409).json({message:"The Branching Room Doesnot exsists"});}
        const deleteMessage = await messagesModel.findOneAndDelete({messageId: req.params.messageId});
        if(deleteMessage){ return res.status(200).json({message: "Success"});}

    }catch (err){
        next(err);
    }

};


module.exports = {createBranchingRoom,createMessageInABranchingRoom,getAMessageInABranchingRoom, getAllBranchingRooms, getAllMessagesInBranchingRoom, getBranchingRoom, updateBranchingRoomTopic, updateMessageInBranchingRoom, deleteAllBranchingRooms, deleteBranchingRoom, deleteMessageInBranchingRoom}


