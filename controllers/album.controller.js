const express = require('express');
const getLoggedInUser = require('../utils/getLoggedInUser');
const toHHMMSS = require('../utils/toHHMMSS');
const Album = require('../models/album.model');
const Song = require('../models/song.model');
const Review = require('../models/review.model');

/**
 * @async
 * @function
 * renders the AddAlbum page to the logged in user
 * if they are an artist.
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Render the add album page or displays
 * any error if they occur
 */
exports.addAlbumPage = async (req, res) => {
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

    res.status(200).render('AddAlbum', { user, isUpdate: false });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error' });
  }
};

/**
 * @async
 * @function
 * renders the UpdateAlbum page to the logged in user
 * if they are an artist.
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Render the update album page or displays
 * any error if they occur
 */
exports.updateAlbumPage = async (req, res) => {
  const { Name } = req.query;

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

    const album = await Album.findOne({
      Name,
      Artist: user.isArtist.StageName,
    });

    // no album of such name
    if (!album) {
      return res.status(404).render('Error', {
        status: 404,
        message: 'Album not found in your discography',
      });
    }

    res.status(200).render('AddAlbum', { user, album, isUpdate: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error' });
  }
};

/**
 * @async
 * @function
 * Creates an album document
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Creates a album document or displays
 * any error if they occur
 */
exports.createAlbum = async (req, res) => {
  const { Name, ReleaseDate } = req.body;

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

    const album = new Album({
      Name,
      ReleaseDate,
      Artist: user.isArtist.StageName,
      Cover: `https://ui-avatars.com/api/name=${Name}&background=random`,
    });

    await album.save();
    res.status(200).redirect(`/artists/${user.isArtist.StageName}`);
  } catch (error) {
    console.error(error);
    res.status(505).send({ status: 500, message: 'Internal server error.' });
  }
};

/**
 * @async
 * @function
 * Delete an album document
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Delete an album document or displays
 * any error if they occur
 */
exports.deleteAlbum = async (req, res) => {
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

    let album = await Album.findOne({ Artist: user.isArtist.StageName, Name });

    // No such album
    if (!album) {
      return res
        .status(404)
        .render('Error', { status: 404, message: 'Album not found.' });
    }

    await album.remove();
    res.status(200).redirect(`/artists/${user.isArtist.StageName}`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};

/**
 * @async
 * @function
 * Updates an album document
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Updates an album document or displays
 * any error if they occur
 */
exports.updateAlbum = async (req, res) => {
  const { Name, ReleaseDate } = req.body;
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

    let album = await Album.findOne({
      Name,
      Artist: user.isArtist.StageName,
    });

    // No album of such name
    if (!album) {
      return res.status(404).render('Error', {
        status: 404,
        message: `Album not found with name ${Name}.`,
      });
    }

    album.Name = Name;
    album.ReleaseDate = ReleaseDate;

    await album.save();
    res.status(201).redirect(`/artists/${user.isArtist.StageName}`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};

/**
 * @async
 * @function
 * Renders the album page
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 *
 * @returns {undefined} - Renders the album page or displays
 * any error if they occur
 */
exports.getAlbum = async (req, res) => {
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

    const album = await Album.findOne({ Name, Artist: StageName });

    if (!album) {
      return res.status(404).render('Error', {
        status: 404,
        message: `No album with name ${Name}`,
      });
    }

    const songs = await Song.find({ Album: Name, Artist: StageName });

    const reviews = await Review.find({
      'Song.Name': { $in: songs.map((song) => song.Name) },
    });
    const avgStars =
      reviews.reduce((prev, currSong) => prev + currSong.Stars, 0) /
      reviews.length;

    res.status(200).render('Album', {
      user,
      StageName,
      album,
      songs,
      avgStars,
      formatTime: toHHMMSS,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};

/**
 * @async
 * @function
 * Handles the upload of the cover of an album
 *
 * @param {express.Request} req - The request object containing the updated
 * artist Name.
 * @param {express.Response} res - The response object
 *
 * @returns {undefined} - This function will update the cover of an album and
 * its songs or render any errors if they occurr
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

    let album = await Album.findOne({ Name, Artist: user.isArtist.StageName });
    // No album of such name
    if (!album) {
      return res.status(404).render('Error', {
        status: 404,
        message: `Album not found with name ${Name}.`,
      });
    }

    album.Cover = `/uploads/${req.file.filename}`;

    await album.save();

    let songsOfAlbum = await Song.find({
      Album: album.Name,
      Artist: user.isArtist.StageName,
    });

    songsOfAlbum.forEach(async (song) => {
      song.Cover = album.Cover;

      await song.save();
    });

    res.redirect(`/artists/${album.Artist}/albums/${album.Name}`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};
