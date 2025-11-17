const mongoose = require("mongoose");


const branchingRoomSchema = new mongoose.Schema({
    branching_room_id : {type : String, unique: true, required: true, immutable : true},
    room_topic : {type: String, enum:["School", "Hobbies", "Food"] ,required : true, },
    branching_room_type: {type: String, enum: ["Local", "Global"], required: true, immutable : true},

    //Foreign key Refference to one of the super type(Local, Global) so that we can track the users. 
    parent_room_id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "branching_room_type", //Would refer to the respective collection
    }

    
});

module.exports = mongoose.model("branchingRoom", branchingRoomSchema);
