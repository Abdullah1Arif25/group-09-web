const GlobalRoom = require('../models/global.model');

// Create global room
const createGlobalRoom = async function (req, res, next) {
  try {
    const roomExists = await GlobalRoom.findOne();
    if (roomExists) {
      return res.status(400).json({ message: "Global room already exists." });
    }

    const room = await GlobalRoom.create(req.body);
    return res.status(201).json(room);

  } catch (err) {
    return next(err);
  }
};

// Get global room
const getGlobalRoom = async function (req, res, next) {
  try {
    const globalRoom = await GlobalRoom.findOne();

    if (!globalRoom) {
      return res.status(404).json({ message: "Global room not found." });
    }

    return res.status(200).json(globalRoom);

  } catch (err) {
    return next(err);
  }
};

// Update live chat status
const updateGlobalRoom = async function (req, res, next) {
  try {
    const { live_Chat } = req.body;

    if (live_Chat === undefined) {
      return res.status(400).json({ message: "live Chat is required." });
    }

    if (req.body.room_Id) {
      return res.status(400).json({ message: "Not allowed to modify Global Room ID." });
    }

    if (!updatedRoom) {
      return res.status(404).json({ message: "Global room not found." });
    }

    return res.status(200).json({ message: "Success."});

  } catch (err) {
    return next(err);
  }
};

// Delete global room
const deleteGlobalRoom = async function (req, res, next) {
  try {
    const deletedRoom = await GlobalRoom.findOneAndDelete({room_Id: req.params.room_Id});

    if (!deletedRoom) {
      return res.status(404).json({ message: "Global room not found." });
    }

    return res.status(200).json({ message: "Successully deleted."});

  } catch (err) {
    return next(err);
  }
};

module.exports = {createGlobalRoom, getGlobalRoom, updateGlobalRoom, deleteGlobalRoom};