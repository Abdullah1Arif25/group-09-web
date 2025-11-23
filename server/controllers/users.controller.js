const bcrypt = require('bcrypt');
const User = require('../models/user.model');

// Register users 
const registerUser = async function(req, res, next) {
  try {
    const {password, personalNumber} = req.body;
    
    if (!personalNumber) {
      return res.status(400).json({ message: "Personal number is required." });
    }

    if (!personalNumber.match(/^\d{10}$/)) {
      return res.status(400).json({ message: "Personal number must be 10 digits." });
    }

    const YY = parseInt(personalNumber[0] + personalNumber[1]);
    const MM = parseInt(personalNumber[2] + personalNumber[3]); 
    const DD = parseInt(personalNumber[4] + personalNumber[5]); 

    if (YY >= 8 && YY <= 25) {
      return res.status(400).json({ message: "User must be at least 18 years old." });
    }

    if (MM < 1 || MM > 12) {
      return res.status(400).json({ message: "Invalid month in personal number." });
    }

    if (DD < 1 || DD > 31) {
      return res.status(400).json({ message: "Invalid day in personal number." });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    if (password.length != 8) {
      return res.status(400).json({ message: "Password must be 8 characters." });
    }
    
    const user = await User.create(req.body);
    const newUser = await User.findOne({ userId: req.body.userId });
    res.status(201).json(newUser);
  
  } catch (err) {
    return next(err);
  }
};

// Login User 
const loginUser =  async function(req, res, next) {
  try {
    const { userId, password } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    
    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }
    
    const user = await User.findOne({ userId }).select("+password");
    
    if (!user) {
      return res.status(404).json({ message: 'User does not exist.' });
    }
    const valid = await user.validatePassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Incorrect Password.' });
    }
    
    res.status(200).json({ message: "Login successful." });
  
  } catch (err) {
    return next(err);
  }
};

// Gets all users collection
const getAllUsers = async function (req, res, next) {
  try {
    const users = await User.find();
    return res.status(200).json(users);

  } catch (err) {
    return next(err);
  }
};

// Gets a specific user 
const getAUser = async function(req, res, next) {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    return res.status(200).json(user);
 
  } catch (err) {
    return next(err);
  }
};

// Updates users data
const updateAUser =  async function(req, res, next){
  try{
    const data = {};

    if (req.body.language === "") {
        return res.status(400).json({ message: "Language cannot be empty." });
    }

    if (req.body.password === "") {
        return res.status(400).json({ message: "Password cannot be empty." });
    }

    if (req.body.language != null) {
        data.language = req.body.language;
    }

    if (req.body.password != null) {
      if (req.body.password.length != 8) {
        return res.status(400).json({ message: "Password must be 8 characters." });
      }

      const salt = await bcrypt.genSalt(8);
      const hashed = await bcrypt.hash(req.body.password, salt);
      data.password = hashed;
    }

    const updatedUser = await User.findOneAndUpdate({userId: req.params.userId}, {$set: data}, {new: true, runValidators: true});

    if (!updatedUser) {
      return res.status(404).json({ message: "User does not exist." });
    }
    return res.status(200).json({message : "Success"})

  } catch (err) {
    return next(err);
  }
};

// Deletes user
const deleteAUser = async function (req, res, next) {
  try {
    const deletedUser = await User.findOneAndDelete({ userId: req.params.userId });
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    
    return res.status(200).json({message : "Success"})

  } catch (err) {
    return next(err);
  }
};

module.exports = {registerUser, loginUser, getAllUsers, getAUser, updateAUser, deleteAUser};
