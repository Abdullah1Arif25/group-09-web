const express = require('express');
const router = express.Router();
const GlobalRoom = require('../models/global.model');

// POST /api/global
router.post('/', async (req, res, next) => {
  try {
    const roomExists = await GlobalRoom.findOne();
    if (roomExists){ 
        return res.status(404).json({message:"Global room already exists"});
    }
    const room = await GlobalRoom.create(req.body);
    res.status(201).json(room);
} catch (err) {
  next(err);
  }
});

// GET /api/globalRoom
router.get('/', async (req, res, next) => {
    try {
      const globalRoom = await GlobalRoom.findOne();
      res.status(200).json(globalRoom);
    } catch (err) {
      next(err);
      res.status(404).json({ message: 'Not Found' });
    }
  });

// update /api/live_chat
router.patch("/" ,async (req, res)=>{
    try{
        const updatedRoom = await GlobalRoom.findOneAndUpdate({},{$set:{live_Chat:req.body.live_Chat}},{new:true});
        res.status(200).json({message : "Success",updatedRoom});
    }catch(err){
        res.status(404).json({message:"Not Found", "error" : err})
    }
})

// Delete /api/Global/:room_Id
router.delete("/:room_Id" ,async (req, res)=>{
    try{
        const deletedRoom = await GlobalRoom.findOneAndDelete({room_Id: req.params.room_Id});
        res.status(200).json({message : "Success",deletedRoom});
    }catch(err){
        res.status(500).json({message:"Not Found"})
    }
})

module.exports = router;
