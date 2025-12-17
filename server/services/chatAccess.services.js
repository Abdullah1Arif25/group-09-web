const BranchingRoom = require("../models/branchingroom.model");

async function checkChat(branchingRoomId) {
  const branchingRoom = await BranchingRoom.findOne({ branchingRoomId }).populate("parentRoomId");

  if (!branchingRoom || !branchingRoom.parentRoomId) {
    return false;
  }

  if (branchingRoom.branchingRoomType === "LocalRoom") {
    return branchingRoom.parentRoomId.liveChat === true;
  }

  if (branchingRoom.branchingRoomType === "GlobalRoom") {
    return branchingRoom.parentRoomId.live_Chat === true;
  }

  return false;
}

module.exports = { checkChat };
