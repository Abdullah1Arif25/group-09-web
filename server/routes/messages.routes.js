const express = require('express');
const MessagesRoute = express.Router();
const Message = require('../models/message.model');


// POST createMessage
MessagesRoute.post('/', async (req, res, next)  =>{
  
  try {
    const newMessage = await Message.create(req.body);
  

    res.send(201).json({message:"Successs", "Object": populatedMessage});
    
  } catch (err) {
    next(err);
  }
  
});


// GET getAllMessages
MessagesRoute.get('/', async (req, res, next)  =>{
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
});


// GET getMessageById
MessagesRoute.get('/:messageId', async (req, res, next) =>{
  try {
    const message = await Message.findOne({messageId:req.params.messageId}).populate('Sender').populate('BranchingRoom').populate('ResponseIds');
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (err) {
    next(err);
  }
});



// PATCH patchMessage
MessagesRoute.patch('/:messageId', async (req, res, next)  =>{
  try {
    const patchedMessage = await Message.findOneAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patchedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json(patchedMessage);
  } catch (err) {
    next(err);
  }
});


// DELETE deleteMessage
MessagesRoute.delete('/:messageId', async (req, res, next)  =>{
  try {
    const deletedMessage = await Message.findOneAndDelete({messageId: req.params.messageId});

    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({message: "Successs"});
  } catch (err) {
    next(err);
  }
});

module.exports = MessagesRoute;
