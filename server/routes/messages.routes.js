const express = require('express');
const MessagesRoute = express.Router();

const MessageController = require('../controllers/messages.controllers');


// POST createMessage
MessagesRoute.post('/', MessageController.createMessage);


// POST response to a message
MessagesRoute.post('/:messageId', MessageController.createResponseMessage);

// GET getAllMessages
MessagesRoute.get('/', MessageController.getAllMessages);


// GET getMessageById
MessagesRoute.get('/:messageId', MessageController.getMessageById);



// PATCH patchMessage
MessagesRoute.patch('/:messageId', MessageController.updateMessageById);


// DELETE allMessages
MessagesRoute.delete("/", MessageController.deleteAllMessages);


// DELETE deleteMessage
MessagesRoute.delete('/:messageId', MessageController.deleteMessageById);



module.exports = MessagesRoute;
