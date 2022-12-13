const express = require('express');
const Album = require('../models/album.model');
const Song = require('../models/song.model');
const Review = require('../models/review.model');
const getLoggedInUser = require('../utils/getLoggedInUser');

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

      return res.status(500).send({
        status: 500,
        message: `User not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }

    // Not an artist
    if (!user.isArtist || JSON.stringify(user.isArtist) === '{}') {
      return res.status(403).send({
        status: 403,
        message: 'Forbidden request, you are not an artist.',
      });
    }

    const albums = await Album.find({ Artist: user.isArtist.StageName });

    res.status(200).render('AddSong', { user, albums, isUpdate: false });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, message: 'Internal server error' });
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

      return res.status(404).send({
        status: 404,
        message: `User not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }

    // Not an artist
    if (!user.isArtist || JSON.stringify(user.isArtist) === '{}') {
      return res.status(403).send({
        status: 403,
        message: 'Forbidden request, you are not an artist.',
      });
    }

    const albums = await Album.find({ Artist: user.isArtist.StageName });
    const song = await Song.findOne({ Name, Artist: user.isArtist.StageName });

    // No song of such name
    if (!song) {
      return res.status(404).send({
        status: 404,
        message: `Song not found with name ${Name}.`,
      });
    }

    res.status(200).render('AddSong', { user, albums, song, isUpdate: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, message: 'Internal server error' });
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

      return res.status(500).send({
        status: 500,
        message: `User not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }

    // Not an artist
    if (!user.isArtist || JSON.stringify(user.isArtist) === '{}') {
      return res.status(403).send({
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
    console.error(error);
    res.status(500).send({ status: 500, message: 'Internal server error.' });
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

      return res.status(500).send({
        status: 500,
        message: `User not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }

    // Not an artist
    if (!user.isArtist || JSON.stringify(user.isArtist) === '{}') {
      return res.status(403).send({
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
      return res.status(404).send({
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
    console.error(error);
    res.status(500).send({ status: 500, message: 'Internal server error.' });
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

      return res.status(500).send({
        status: 500,
        message: `User not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }

    // Not an artist
    if (!user.isArtist || JSON.stringify(user.isArtist) === '{}') {
      return res.status(403).send({
        status: 403,
        message: 'Forbidden request, you are not an artist.',
      });
    }

    let song = await Song.findOne({ Artist: user.isArtist.StageName, Name });

    // No such song
    if (!song) {
      return res
        .status(404)
        .send({ status: 404, message: 'Song not found in your discography' });
    }

    await song.remove();
    res.status(200).redirect(`/artists/${user.isArtist.StageName}`);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, message: 'Internal server error.' });
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

      return res.status(500).send({
        status: 500,
        message: `User not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }

    const song = await Song.findOne({ Name, Artist: StageName });

    if (!song) {
      return res.status(404).send({
        status: 404,
        message: `Song not found with name ${Name}.`,
      });
    }

    const reviews = await Review.find({ Song, Artist: StageName });

    let userReview;
    // get user review if it exists
    if (user) {
      userReview = reviews.find((review) => review.User.Name === user.FullName);
    }

    res
      .status(200)
      .render('Song', { user, StageName, song, reviews, userReview });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, message: 'Internal server error.' });
  }
};
