const mongoose = require("mongoose");


const branchingRoomSchema = new mongoose.Schema({
    branchingRoomId : {type : String, unique: true, required: true, immutable : true},
    roomTopic : {type: String, enum:["School", "Hobbies", "Food"] ,required : true, },
    branchingRoomType: {type: String, enum: ["LocalRoom", "GlobalRoom"], required: true, immutable : true},

    //Foreign key Refference to one of the super type(Local, Global) so that we can track the users. 
    parentRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "branchingRoomType", //Would refer to the respective collection
    }

    
});

module.exports = mongoose.model("branchingRoom", branchingRoomSchema);
