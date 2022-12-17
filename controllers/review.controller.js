const express         = require('express');
const logger          = require('../config/logger.config');
const getLoggedInUser = require('../utils/getLoggedInUser');
const Review          = require('../models/review.model');

/**
 * @async
 * @function
 * Creates a review document
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Creates a review document or displays
 * any error if they occur
 */
exports.createReview = async (req, res) => {
  const { Stars, Content } = req.body;
  const { Song, Artist } = req.query;

  try {
    const user = await getLoggedInUser(req);

    // bad session id
    if (user === null) {
      res.clearCookie('uid');

      return res.status(500).render('Error', {
        status: 500,
        message: `User not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }
    const review = new Review({
      Content,
      Stars,
      User: { Avatar: user.Avatar, Name: user.FullName },
      Song: { Name: Song, Artist },
    });

    await review.save();
    res.redirect(`/artists/${Artist}/songs/${Song}`);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};

/**
 * @async
 * @function
 * Updates a review document
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Updates a review document or displays
 * any error if they occur
 */
exports.updateReview = async (req, res) => {
  const { Stars, Content } = req.body;
  const { Song, Artist } = req.query;

  try {
    const user = await getLoggedInUser(req);

    // bad session id
    if (user === null) {
      res.clearCookie('uid');

      return res.status(500).render('Error', {
        status: 500,
        message: `User not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }

    let review = await Review.findOne({
      'User.Name': user.FullName,
      'Song.Name': Song,
      'Song.Artist': Artist,
    });

    if (!review) {
      return res.status(404).render('Error', {
        status: 404,
        message: `You have no reviews for the song ${Song}`,
      });
    }

    review.Stars = Stars;
    review.Content = Content;

    await review.save();
    res.redirect(`/artists/${Artist}/songs/${Song}`);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};
