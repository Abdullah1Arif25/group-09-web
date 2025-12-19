const Message = require('../models/message.model');
const BranchingRoom = require('../models/branchingroom.model');


async function responceToMessageInABranchingRoom(branchingRoomId, anonymousName ,MessageBody, parentMessageId){
    try{
        const room = await BranchingRoom.findOne({branchingRoomId: branchingRoomId});        
        if(!room){console.log("The room is not available");}
        const branchingRoomObjectId = room._id;

        //Check if the Message Already exists
        const originalMessage = await Message.findOne({messageId: parentMessageId});

        if(!originalMessage){ return console.log("Original Message Does not exist");}

        const newMessage = await Message.create({...MessageBody, BranchingRoom: branchingRoomObjectId, anonymousName : anonymousName});
        originalMessage.ResponseIds.push(newMessage._id);
        await originalMessage.populate("ResponseIds");
        await originalMessage.save();
        console.log("Success");

        return newMessage;

        

    } catch(err){

    }

}

module.exports = {responceToMessageInABranchingRoom};


