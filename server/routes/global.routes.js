const express = require('express');
const router = express.Router();
const {createGlobalRoom, getGlobalRoom, updateGlobalRoom, deleteGlobalRoom} = require('../controllers/global.controllers');

// POST /api/global
router.post('/', createGlobalRoom);

// GET /api/globalRoom
router.get('/', getGlobalRoom);

// PUT /api/live_chat
router.put('/', updateGlobalRoom);

// Delete /api/Global/:room_Id
router.delete('/:room_Id', deleteGlobalRoom);

module.exports = router;
