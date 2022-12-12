// Requires
// ----------------------------------------------------------------------------
const express = require('express');
const router = express.Router();

// Controller
// ----------------------------------------------------------------------------
const userController = require('../controllers/user.controller');

// GET Requests
router.get('/join', userController.joinPage);
router.get('/profiles/:FullName', userController.getProfile);
router.get('/editProfile', userController.editProfilePage);

// POST Requests
router.post('/registerUser', userController.createUser);
router.post('/signOut', userController.userSignOut);
router.post('/signIn', userController.userSignIn);

// exporting
module.exports = router;
