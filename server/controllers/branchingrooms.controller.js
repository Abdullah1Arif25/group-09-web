const express = require("express");
const BranchingRoom = require("../models/branchingroom.model");
const messagesModel = require("../models/message.model");
const User = require("../models/user.model");



// POST:  Create One Brancing Rooms
const createBranchingRoom = async function(req, res, next){
    try{
        const {branchingRoomType, roomTopic} = req.body;
        const validRoomType = ["LocalRoom", "GlobalRoom"];

        const validRoomTopic = ["General", "Scandle", "Relationships", "Travel","Movies", "Books", "Sports", "Food", "School"];

        if(!validRoomType.includes(branchingRoomType)){
            res.status(400).json({message: "Invalid Branching Room Type"});
        }

        if(!validRoomTopic.includes(roomTopic)){
            res.status(400).json({message: "Invalid Branching Room Topic"});            
        }

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
        if(!branchingRoom){ return res.status(400).json({message:"The Branching Room Does not exists"});}
        const branchingRoomObjectId = branchingRoom._id;

        const newMessage = await messagesModel.create({BranchingRoom: branchingRoomObjectId, ...req.body});
        res.status(201).json({message: "Success", Object: newMessage});

    }catch (err){
        next(err);
    }

};


// POST: Create A response message in a specific Branching Room and link it to the original message
const respondtoMessageInABranchingRoom = async function(req, res, next){
       try{

        const branchingRoom = await BranchingRoom.findOne({branchingRoomId: req.params.branchingRoomId});        
        if(!branchingRoom){ return res.status(409).json({message:"The Branching Room Does not exists"});}
        const branchingRoomObjectId = branchingRoom._id;
        
        //Check if the Message Already exists
        const originalMessageId = req.params.messageId;
        const originalMessage = await messagesModel.findOne({messageId: originalMessageId});

        if(!originalMessage){ return res.status(400).json({message:"The Message Does not exists"});}
        const originalMessageObjectId = originalMessage._id;

        const newReponseMessage = await messagesModel.create({BranchingRoom: branchingRoomObjectId,ParentMessageId:originalMessageObjectId ,  ...req.body});

        await newReponseMessage.populate("ParentMessageId");

        res.status(201).json({message: "Success", Object: newReponseMessage});

    }catch (err){
        next(err);
    }

};

// POST: Create/Update a reaction for a message
const reactToMessageInABranchingRoom = async function (req, res, next) {
    try {
        const { branchingRoomId, messageId } = req.params;
        const { reaction, userId } = req.body; 

        const validReactions = ['👍', '❤️', '😂', '😢', '😡'];
        console.log()

        if (!validReactions.includes(reaction)) {
            return res.status(400).json({ message: "Invalid reaction" });
        }

        // Make sure room exists
        const branchingRoom = await BranchingRoom.findOne({ branchingRoomId:branchingRoomId });
        if (!branchingRoom) {
            return res.status(404).json({ message: "Branching room not found" });
        }

        // Find message by messageId
        const message = await messagesModel.findOne({
            messageId: messageId
        });

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        // Save reaction
        message.Reactions.push(req.body);
        const savedMessage = await message.save();
        await savedMessage.populate("Reactions");

        res.status(200).json({
            message: "Reaction saved",
            Object: savedMessage
        });

    } catch (err) {
        next(err);
    }
};


// POST: Checks if user and branching room exists before joining
const joinRoom = async function(req, res, next){
    try{

        const { userId, roomId } = req.body;

        const user = await User.findOne({ userId });
        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        const room = await BranchingRoom.findOne({ branchingRoomId: roomId });
        if(!room){
            return res.status(400).json({message: "Room not found"});
        }

        res.status(200).json({
            message: "Success", userObjectId: user._id,roomObjectId: room._id
        });

    }catch(err){
        next(err);
    }
};

// GET: Read All Branching Rooms
const getAllBranchingRooms = async function(req, res, next){
    try{

        const { branchingRoomType, language } = req.query;

        if (branchingRoomType === "LocalRoom" && language && language !== "swe")  {
            return res.status(403).json({
                message: "Local rooms are only available for Swedish speacking users"
            });
        }

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
        const allmessagesModelInBranchingRoom = await messagesModel.find({BranchingRoom: branchingRoom._id}).populate("BranchingRoom").populate("ParentMessageId").populate("Sender");
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
        const MessageInBranchingRoom = await messagesModel.findOne({messageId: req.params.messageId}).populate("ParentMessageId").populate("BranchingRoom").populate("Sender");
        if(!allmessagesModelInBranchingRoom){ res.status(404).json({message:"Not Found"});}
        res.status(200).json(MessageInBranchingRoom);

    }catch (err){
        next(err);
    }

};



// Update One Branhing Room
const updateBranchingRoomTopic = async function(req, res, next){
    try{

        const { roomTopic} = req.body;

        const validRoomTopic = ["General", "Scandle", "Relationships", "Travel","Movies", "Books", "Sports", "Food", "School"];
    
        if(!validRoomTopic.includes(roomTopic)){
            res.status(400).json({message: "Invalid Branching Room Topic"});            
        }
        const updatedRoom = await BranchingRoom.findOneAndUpdate({

            
            branchingRoomId: req.params.branchingRoomId},
            {$set:{
                roomTopic: roomTopic
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
        if(!branchingRoom){ return res.status(400).json({message:"The Branching Room Does not exists"});}
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
        if(!branchingRoom){ return res.status(400).json({message:"The Branching Room Does not exists"});}
        const deleteMessage = await messagesModel.findOneAndDelete({messageId: req.params.messageId});
        if(deleteMessage){ return res.status(200).json({message: "Success"});}

    }catch (err){
        next(err);
    }

};


module.exports = {respondtoMessageInABranchingRoom,createBranchingRoom,createMessageInABranchingRoom, reactToMessageInABranchingRoom,joinRoom,getAMessageInABranchingRoom, getAllBranchingRooms, getAllMessagesInBranchingRoom, getBranchingRoom, updateBranchingRoomTopic, updateMessageInBranchingRoom, deleteAllBranchingRooms, deleteBranchingRoom, deleteMessageInBranchingRoom}


