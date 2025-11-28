const express = require('express');
const router = express.Router();
const {createGlobalRoom, getGlobalRoom, updateGlobalRoom, deleteGlobalRoom} = require('../controllers/global.controllers');

// POST /api/globalroom
router.post('/', createGlobalRoom);

// GET /api/globalroom
router.get('/', getGlobalRoom);

// PUT /api/globalroom/:room_Id
router.put('/:room_Id', updateGlobalRoom);

// Delete /api/globalroom/:room_Id
router.delete('/:room_Id', deleteGlobalRoom);

module.exports = router;