const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

// POST /api/users
router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// GET /api/users
router.get('/', async (req, res, next) => {
    try {
      const users = await User.find();
      res.status(201).json(users);
    } catch (err) {
      next(err);
      res.status(404).json({ message: 'Not Found' });
    }
  });

// GET /api/users:UserId
router.get('/:userId', async (req, res, next) => {
    try {
      const users = await User.findOne({userId: req.params.userId});
      res.status(200).json(users);
    } catch (err) {
      next(err);
      res.status(404).json({message: "Not Found"})
    }
  });


// update /api/users/:userId
router.patch("/:userId" ,async (req, res)=>{
    try{
        const updatedUser = await User.findOneAndUpdate({userId: req.params.userId}, req.body, {new: true , runValidators: true})
        if (!updatedUser){res.status(404).json({message:"The User Does not exsist"})}
        res.status(200).json({message : "Success"})

    }catch(err){
        res.status(404).json({message:"Not Found", "error" : err})
    }
})

// Delete /api/users/:userId
router.delete("/:userId" ,async (req, res)=>{
    try{
        const updatedUser = await User.findOneAndDelete({userId: req.params.userId}, req.body, {new: true , runValidators: true})
        res.status(200).json({message : "Success"})

    }catch(err){
        res.status(204).json({message:"Not Found"})
    }
})


module.exports = router;
