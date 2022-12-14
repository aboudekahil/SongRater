// Requires
// ----------------------------------------------------------------------------
const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');

// Controller
// ----------------------------------------------------------------------------
const songController = require('../controllers/song.controller');

// GET Requests
router.get('/addSong', songController.addSongPage);
router.get('/updateSong', songController.updateSongPage);
router.get('/artists/:StageName/songs/:Name', songController.getSong);

// POST Requests
router.post('/addSong', songController.createSong);
router.post('/updateSong', songController.updateSong);
router.post('/deleteSong', songController.deleteSong);
router.post('/uploadSongCover', upload.single('cover'), songController.uploadCover);

// exporting
module.exports = router;
