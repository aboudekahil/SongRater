// Requires
// ----------------------------------------------------------------------------
const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');

// Controller
// ----------------------------------------------------------------------------
const albumController = require('../controllers/album.controller');

// GET Requests
router.get('/addAlbum', albumController.addAlbumPage);
router.get('/updateAlbum', albumController.updateAlbumPage);
router.get('/artists/:StageName/albums/:Name', albumController.getAlbum);

// POST Requests
router.post('/addAlbum', albumController.createAlbum);
router.post('/deleteAlbum', albumController.deleteAlbum);
router.post('/updateAlbum', albumController.updateAlbum);
router.post(
  '/uploadAlbumCover',
  upload.single('cover'),
  albumController.uploadCover
);

// exporting
module.exports = router;
