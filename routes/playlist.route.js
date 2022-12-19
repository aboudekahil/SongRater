// Requires
// ----------------------------------------------------------------------------
const express = require('express');
const router = express.Router();

// Controller
// ----------------------------------------------------------------------------
const playlistController = require('../controllers/playlist.controller');

// GET requests
router.get('/:FullName/playlists/:Name', playlistController.getPlaylistPage);
router.get('/:FullName/playlists', playlistController.getPlaylistsPage);

// POST requests
router.post('/createPlaylist', playlistController.createPlaylist);
router.post('/addToPlaylist', playlistController.addSongToPlaylist);
router.post('/removeFromPlaylist', playlistController.removeSongFromPlaylist);
router.post('/deletePlaylist', playlistController.deletePlaylist);
router.post('/getUserPlaylists', playlistController.getUserPlaylists);

// exporting
module.exports = router;
