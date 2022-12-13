// Requires
// ----------------------------------------------------------------------------
const express = require('express');
const router = express.Router();

// Controller
// ----------------------------------------------------------------------------
const songController = require('../controllers/song.controller');

// GET Requests
router.get('/addSong', songController.addSongPage);
router.get('/updateSong', songController.updateSongPage);

// POST Requests
router.post('/addSong', songController.createSong);
router.post('/updateSong', songController.updateSong);
router.post('/deleteSong', songController.deleteSong);

// exporting
module.exports = router;
