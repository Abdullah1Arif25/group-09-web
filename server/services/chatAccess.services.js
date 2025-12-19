const BranchingRoom = require("../models/branchingroom.model");
const LocalRoom = require("../models/localroom.model");
const GlobalRoom = require("../models/globalroom.model");

async function checkChat(branchingRoomId) {
  const branchingRoom = await BranchingRoom.findOne({ branchingRoomId });

  if (!branchingRoom) {
    return false;
  }

  if (branchingRoom.branchingRoomType === "LocalRoom") {
    const localRoom = await LocalRoom.findById(branchingRoom.parentRoomId);
    if (!localRoom) return false;
    return localRoom.liveChat === true;
  }

  if (branchingRoom.branchingRoomType === "GlobalRoom") {
    const globalRoom = await GlobalRoom.findById(branchingRoom.parentRoomId);
    if (!globalRoom) return false;
    return globalRoom.live_Chat === true;
  }

  return false;
}

module.exports = { checkChat };
