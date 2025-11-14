const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');

// POST /api/messages
router.post('/', async function (req, res, next) {
  const msg = new Message(req.body);
  try {
    await msg.save();
  } catch (err) {
    return next(err);
  }
  res.status(201).json(msg);
});

// GET /api/messages
router.get('/', async function (req, res, next) {
  try {
    const messages = await Message.find();
    res.json({ messages });
  } catch (err) {
    return next(err);
  }
});

// GET /api/messages/:id
router.get('/:id', async function (req, res, next) {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json(msg);
  } catch (err) {
    return next(err);
  }
});

// PUT /api/messages/:id
router.put('/:id', async function (req, res, next) {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    // replace fields
    msg.MessageId = req.body.MessageId;
    msg.SendTimestamp = req.body.SendTimestamp;
    msg.Reaction = req.body.Reaction;
    msg.ResponseIds = req.body.ResponseIds;
    msg.UserId = req.body.UserId;

    await msg.save();
    res.json(msg);
  } catch (err) {
    return next(err);
  }
});

// PATCH /api/messages/:id
router.patch('/:id', async function (req, res, next) {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    // update only provided fields
    msg.MessageId = req.body.MessageId || msg.MessageId;
    msg.SendTimestamp = req.body.SendTimestamp || msg.SendTimestamp;
    msg.Reaction = req.body.Reaction || msg.Reaction;
    msg.ResponseIds = req.body.ResponseIds || msg.ResponseIds;
    msg.UserId = req.body.UserId || msg.UserId;

    await msg.save();
    res.json(msg);
  } catch (err) {
    return next(err);
  }
});

// DELETE /api/messages/:id
router.delete('/:id', async function (req, res, next) {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json(msg);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;