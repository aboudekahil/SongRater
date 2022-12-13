// Requires
// ----------------------------------------------------------------------------
const express = require('express');
const router = express.Router();

// Controller
// ----------------------------------------------------------------------------
const reviewController = require('../controllers/review.controller');

// POST Requests
router.post('/addReview', reviewController.createReview);
router.post('/updateReview', reviewController.updateReview);

// exporting
module.exports = router;
