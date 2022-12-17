const express         = require('express');
const logger          = require('../config/logger.config')
const getLoggedInUser = require('../utils/getLoggedInUser');
const Album           = require('../models/album.model');
const Song            = require('../models/song.model');
const User            = require('../models/user.model');

/**
 * @async
 * @function
 * Render the homepage.
 *
 * @param {express.Request} req - The express request object
 * @param {express.Response} res - The express response object
 *
 * @returns {undefined} - This function will render a page or
 * display any errors if they occur
 */
exports.getHomePage = async (req, res) => {
  try {
    let user = await getLoggedInUser(req);

    // bad session id
    if (user === null) {
      res.clearCookie('uid');

      return res.status(500).render('Error', {
        status: 500,
        message: `user not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }
    res.render('Homepage', { user });
  } catch (err) {
    // Handle any error that occurred in the query
    logger.error(err);
    res.status(500).render('Error', {
      status: 500,
      message: `Internal server occurred`,
    });
  }
};

/**
 * @async
 * @function
 * Returns the results of the search query.
 *
 * @param {express.Request} req - The express request object
 * @param {express.Response} res - The express response object
 *
 * @returns {undefined} - This function will render the results of the search
 *  query or display any errors if they occur
 */
exports.query = async (req, res) => {
  const { query } = req.query;

  try {
    let user = await getLoggedInUser(req);

    // bad session id
    if (user === null) {
      res.clearCookie('uid');

      return res.status(500).render('Error', {
        status: 500,
        message: `user not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }

    const songs = await Song.find({
      $or: [
        { Name: { $regex: `.*${query}.*`, $options: 'i' } },
        { Artist: { $regex: `.*${query}.*`, $options: 'i' } },
      ],
    });
    const albums = await Album.find({
      $or: [
        {
          Name: { $regex: `.*${query}.*`, $options: 'i' },
        },
        { Artist: { $regex: `.*${query}.*`, $options: 'i' } },
      ],
    });

    const artists = await User.find({
      $or: [
        { 'isArtist.StageName': { $regex: `.*${query}.*`, $options: 'i' } },
        {
          'isArtist.StageName': { $regex: `.*`, $options: 'i' },
          FullName: { $regex: `.*${query}.*`, $options: 'i' },
        },
      ],
    });

    res
      .status(200)
      .render('Search', { user, query, results: { songs, albums, artists } });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};
