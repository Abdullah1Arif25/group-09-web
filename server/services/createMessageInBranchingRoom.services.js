const Message = require('../models/message.model');
const BranchingRoom = require('../models/branchingroom.model');


async function createMessageInABranchingRoom(branchingRoomId, anonymousName ,MessageBody){
    const branchingRoom = await BranchingRoom.findOne({branchingRoomId});
    if(!branchingRoom){
        throw new Error("Branching Room Does not exist");
    }
    const branchingRoomObjectId = branchingRoom._id;

    const newMessage = await Message.create({...MessageBody, BranchingRoom: branchingRoomObjectId, anonymousName : anonymousName});

    return newMessage;

}

module.exports = {createMessageInABranchingRoom};


