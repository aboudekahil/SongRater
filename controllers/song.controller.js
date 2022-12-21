const express = require('express');
const logger = require('../config/logger.config');
const toHHMMSS = require('../utils/toHHMMSS.util');
const getLoggedInUser = require('../utils/getLoggedInUser.util');
const Album = require('../models/album.model');
const Song = require('../models/song.model');
const Review = require('../models/review.model');
const axios = require('axios').default;

/**
 * @async
 * @function
 * renders the AddSong page to the logged in user
 * if they are an artist.
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Render the add song page or displays
 * any error if they occur
 */
exports.addSongPage = async (req, res) => {
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

    // Not an artist
    if (!user.isArtist || JSON.stringify(user.isArtist) === '{}') {
      return res.status(403).render('Error', {
        status: 403,
        message: 'Forbidden request, you are not an artist.',
      });
    }

    const albums = await Album.find({ Artist: user.isArtist.StageName });

    res.status(200).render('AddSong', { user, albums, isUpdate: false });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).render('Error', {
        status: 409,
        message: 'Song name for artist already exists',
      });
    } else {
      logger.error(`${__filename} -`, error);
      res
        .status(500)
        .render('Error', { status: 500, message: 'Internal sevrer error.' });
    }
  }
};

/**
 * @async
 * @function
 * renders the UpdateSong page to the logged in user
 * if they are an artist.
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Render the update song page or displays
 * any error if they occur
 */
exports.updateSongPage = async (req, res) => {
  const { Name } = req.query;

  try {
    const user = await getLoggedInUser(req);

    // bad session id
    if (user === null) {
      res.clearCookie('uid');

      return res.status(404).render('Error', {
        status: 404,
        message: `User not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }

    // Not an artist
    if (!user.isArtist || JSON.stringify(user.isArtist) === '{}') {
      return res.status(403).render('Error', {
        status: 403,
        message: 'Forbidden request, you are not an artist.',
      });
    }

    const albums = await Album.find({ Artist: user.isArtist.StageName });
    const song = await Song.findOne({ Name, Artist: user.isArtist.StageName });

    // No song of such name
    if (!song) {
      return res.status(404).render('Error', {
        status: 404,
        message: `Song not found with name ${Name}.`,
      });
    }

    res.status(200).render('AddSong', { user, albums, song, isUpdate: true });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).render('Error', {
        status: 409,
        message: 'Song name for artist already exists',
      });
    } else {
      logger.error(`${__filename} -`, error);
      res
        .status(500)
        .render('Error', { status: 500, message: 'Internal sevrer error.' });
    }
  }
};

/**
 * @async
 * @function
 * Creates a song document
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Creates a song document or displays
 * any error if they occur
 */
exports.createSong = async (req, res) => {
  const { Name, Album, ReleaseDate, Length } = req.body;
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

    // Not an artist
    if (!user.isArtist || JSON.stringify(user.isArtist) === '{}') {
      return res.status(403).render('Error', {
        status: 403,
        message: 'Forbidden request, you are not an artist.',
      });
    }

    const song = new Song({
      Name,
      Artist: user.isArtist.StageName,
      Album,
      ReleaseDate: new Date(ReleaseDate),
      Length,
      Cover: `https://ui-avatars.com/api/name=${Name}&background=random`,
    });

    await song.save();
    res.status(201).redirect(`/artists/${user.isArtist.StageName}`);
  } catch (error) {
    logger.error(`${__filename} -`, error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};

/**
 * @async
 * @function
 * Updates a song document
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Updates a song document or displays
 * any error if they occur
 */
exports.updateSong = async (req, res) => {
  const { Name, Album, ReleaseDate, Length } = req.body;
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

    // Not an artist
    if (!user.isArtist || JSON.stringify(user.isArtist) === '{}') {
      return res.status(403).render('Error', {
        status: 403,
        message: 'Forbidden request, you are not an artist.',
      });
    }

    let song = await Song.findOne({
      Name,
      Artist: user.isArtist.StageName,
    });

    // No song of such name
    if (!song) {
      return res.status(404).render('Error', {
        status: 404,
        message: `Song not found with name ${Name}.`,
      });
    }

    song.Name = Name;
    song.Album = Album;
    song.ReleaseDate = ReleaseDate;
    song.Length = Length;

    await song.save();
    res.status(201).redirect(`/artists/${user.isArtist.StageName}`);
  } catch (error) {
    logger.error(`${__filename} -`, error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};

/**
 * @async
 * @function
 * Delete a song document
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Delete a song document or displays
 * any error if they occur
 */
exports.deleteSong = async (req, res) => {
  const { Name } = req.body;

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

    // Not an artist
    if (!user.isArtist || JSON.stringify(user.isArtist) === '{}') {
      return res.status(403).render('Error', {
        status: 403,
        message: 'Forbidden request, you are not an artist.',
      });
    }

    let song = await Song.findOne({ Artist: user.isArtist.StageName, Name });

    // No such song
    if (!song) {
      return res.status(404).render('Error', {
        status: 404,
        message: 'Song not found in your discography',
      });
    }

    await song.remove();
    res.status(200).redirect(`/artists/${user.isArtist.StageName}`);
  } catch (error) {
    logger.error(`${__filename} -`, error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};

/**
 * @async
 * @function
 * Renders the requested song page
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Render the requested song page or displays
 * any error if they occur
 */
exports.getSong = async (req, res) => {
  const { StageName, Name } = req.params;

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

    const song = await Song.findOne({
      Name: Name,
      Artist: StageName,
    });

    if (!song) {
      return res.status(404).render('Error', {
        status: 404,
        message: `Song not found with name ${Name}.`,
      });
    }

    const reviews = await Review.find({
      'Song.Name': Name,
      'Song.Artist': StageName,
    });

    let userReview;
    // get user review if it exists
    if (user) {
      userReview = reviews.find((review) => review.User.Name === user.FullName);
    }

    res.status(200).render('Song', {
      user,
      StageName,
      song,
      reviews,
      userReview,
      formatTime: toHHMMSS,
    });
  } catch (error) {
    logger.error(`${__filename} -`, `${__filename} -`, error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};

/**
 * @async
 * @function
 * Handles the upload of the song cover
 *
 * @param {express.Request} req - The request object containing the updated
 * artist Name.
 * @param {express.Response} res - The response object
 *
 * @returns {undefined} - This function will update the song cover of a song or
 * render any errors if they occurr
 */
exports.uploadCover = async (req, res) => {
  const { Name } = req.query;
  try {
    if (!req.cookies.uid) {
      res.status(400).render('Error', { status: 400, message: 'Bad request' });
      return;
    }

    let user = await getLoggedInUser(req);

    // bad session id
    if (user === null) {
      res.clearCookie('uid');

      return res.status(500).render('Error', {
        status: 500,
        message: `user not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }

    // Not an artist
    if (!user.isArtist || JSON.stringify(user.isArtist) === '{}') {
      return res.status(403).render('Error', {
        status: 403,
        message: 'Forbidden request, you are not an artist.',
      });
    }

    let song = await Song.findOne({ Name, Artist: user.isArtist.StageName });
    // No song of such name
    if (!song) {
      return res.status(404).render('Error', {
        status: 404,
        message: `Song not found with name ${Name}.`,
      });
    }

    song.Cover = `/uploads/${req.file.filename}`;

    await song.save();
    res.redirect(`/artists/${song.Artist}/songs/${song.Name}`);
  } catch (error) {
    logger.error(`${__filename} -`, error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};

/**
 * @async
 * @function
 *
 * A function that gets a track from Last.fm based on a given name and artist.
 * The track is then saved to the database and the user is redirected to the track page.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 *
 * @returns {undefined} The user is redirected to the track page.
 */
exports.getFromLastFm = async (req, res) => {
  const { Name } = req.body;
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

    // Not an artist
    if (!user.isArtist || JSON.stringify(user.isArtist) === '{}') {
      return res.status(403).render('Error', {
        status: 403,
        message: 'Forbidden request, you are not an artist.',
      });
    }

    // make a GET request to the API
    const response = await axios.get(
      `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${process.env.LAST_FM}&artist=${user.isArtist.StageName}&track=${Name}&format=json`
    );
    // parse the response body as JSON
    const data = response.data;

    let match = data.track;

    let cover = match.album;
    console.log(cover);

    let song = new Song({
      Name: match.name,
      Artist: user.isArtist.StageName,
      Length: Math.floor(match.duration / 1000),
      Links: [match.url],
      ReleaseDate: new Date(),
      Cover: cover
        ? cover.image.at(-1)['#text']
        : `https://ui-avatars.com/api/name=${Name}&background=random`,
    });

    await song.save();
    res.redirect(`/artists/${user.isArtist.StageName}/songs/${match.name}`);
  } catch (error) {
    logger.error(`${__filename} -`, error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};
