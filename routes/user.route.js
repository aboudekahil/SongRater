// Requires
// ----------------------------------------------------------------------------
const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');

// Controller
// ----------------------------------------------------------------------------
const userController = require('../controllers/user.controller');

// GET Requests
router.get('/join', userController.joinPage);
router.get('/profiles/:FullName', userController.getProfile);
router.get('/editProfile', userController.editProfilePage);
router.get('/artists/:StageName', userController.getDiscography);

// POST Requests
router.post('/registerUser', userController.createUser);
router.post('/signOut', userController.userSignOut);
router.post('/signIn', userController.userSignIn);
router.post('/editProfile', userController.updateUser);
router.post('/uploadPfp', upload.single('avatar'), userController.pfpUpload);

// exporting
module.exports = router;
