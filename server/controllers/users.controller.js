const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

// POST /api/userslregister
const registerUser = async function(req, res, next) {
  try {
    const {password} = req.body;
    if (!password || password.length != 8) {
      return res.status(400).json({
        message: "Password must 8 characters long"
      });
    }
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// POST /api/users/login
const loginUser =  async function(req, res, next) {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const checkPassword = await user.validatePassword(password);
    if (!checkPassword) {
      return res.status(401).json({ message: 'Incorrect Password' });
}
    res.status(200).json({
    message: "Login successful"
});
  } catch (err) {
    next(err);
  }
};

// GET /api/users:UserId
const getAUser = async function(req, res, next) {
    try {
      const users = await User.findOne({userId: req.params.userId});
      res.status(200).json(users);
    } catch (err) {
      next(err);
      res.status(404).json({message: "Not Found"})
    }
  };


// update /api/users/:userId
const updateAUser =  async function(req, res){
    try{
        const updatedUser = await User.findOneAndUpdate({userId: req.params.userId}, req.body, {new: true , runValidators: true})
        if (!updatedUser){res.status(404).json({message:"The User Does not exsist"})}
        res.status(200).json({message : "Success"})

    }catch(err){
        res.status(404).json({message:"Not Found", "error" : err})
    }
};

// Delete /api/users/:userId
const deleteAUser = async function(req, res){
    try{
        const updatedUser = await User.findOneAndDelete({userId: req.params.userId}, req.body, {new: true , runValidators: true})
        res.status(200).json({message : "Success"})

    }catch(err){
        res.status(204).json({message:"Not Found"})
    }
};


module.exports = {loginUser, registerUser, getAUser, updateAUser, deleteAUser};
