// Requires
// ----------------------------------------------------------------------------
const express = require('express');
const router = express.Router();

// Controller
// ----------------------------------------------------------------------------
const homeController = require('../controllers/home.controller');

// GET Requests
router.get('/', homeController.getHomePage);

// exporting
module.exports = router;
