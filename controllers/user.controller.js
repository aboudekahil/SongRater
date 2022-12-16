const express = require('express');
const sessionManager = require('../config/session.config');
const User = require('../models/user.model');
const Country = require('../models/country.model');
const Song = require('../models/song.model');
const Album = require('../models/album.model');
const getLoggedInUser = require('../utils/getLoggedInUser');

/**
 * @async
 * @function
 * Create a user in the backend and write a cookie to the user.
 *
 * @param {express.Request} req - The express request object
 * @param {express.Response} res - The express response object
 *
 * @returns {undefined} - This function will reroute to the homepage or
 * return an error response
 */
exports.createUser = async (req, res) => {
  const {
    FullName,
    Email,
    Password,
    Country,
    DOB,
    Avatar,
    isArtist,
    StageName,
  } = req.body;

  const user = new User({
    FullName,
    Email,
    Password,
    Country,
    DOB,
    Avatar:
      Avatar || `https://ui-avatars.com/api/name=${FullName}&background=random`,
    isArtist: isArtist ? { StageName } : undefined,
  });

  try {
    let createdUser = await user.save();
    let [sessionId, expiration] = await sessionManager.createSession(
      createdUser._id.toString()
    );

    // set cookie
    res.cookie('uid', sessionId, {
      expire: expiration,
      secure: true,
      httpOnly: true,
    });

    res.status(201).redirect('/');
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).render('Error', {
        status: 409,
        message: 'Email or Name already exists',
      });
    } else {
      console.error(error);
      res.status(500).render('Error', {
        status: 500,
        message: `Something wen't wrong`,
      });
    }
  }
};

/**
 * @async
 * @function
 * Renders the sign up and login page.
 *
 * @param {express.Request} req - The express request object
 * @param {express.Response} res - The express response object
 *
 * @returns {undefined} - This function will reroute to the homepage or
 * return an error response
 */
exports.joinPage = async (req, res) => {
  try {
    const user = req.cookies.uid
      ? await sessionManager.getUserId(req.cookies.uid)
      : 0;

    if (user === null) {
      // bad session id
      res.clearCookie('uid');

      return res.status(500).render('Error', {
        status: 500,
        message: `User not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }

    const countries = await Country.find({});

    res.status(200).render('Joinpage', { countries });
  } catch (err) {
    // Handle any error that occurred in the query
    console.error(err);
    res.status(500).render('Error', {
      status: 500,
      message: `Internal server occurred`,
    });
  }
};

/**
 * @async
 * @function
 * Renders the edit profile page for the currently logged-in user.
 *
 * @param {express.Request} req - The request object containing
 * the user's session ID.
 * @param {express.Response} res - The response object to send the rendered
 *  page to the client.
 *
 * @returns {undefined} - renders the edit profile page, or displays any errors
 * if they occur
 */
exports.editProfilePage = async (req, res) => {
  try {
    if (!req.cookies.uid) {
      return res
        .status(400)
        .render('Error', { status: 400, message: 'bad request.' });
    }

    const user = await getLoggedInUser(req);
    const countries = await Country.find({});
    const isArtist = !(JSON.stringify(user.isArtist) === '{}'); // check if the user is an artist

    res.status(200).render('EditProfile', { user, countries, isArtist });
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
 * Signs out the user, clear his cookies and deletes his session
 *
 * @param {express.Request} req - Express Request object
 * @param {express.Response} res - Express Response object
 *
 * @returns {undefined} - sends a response indicating that
 *   the user has signed out successfully or sends any errors if they
 *   occurred
 */
exports.userSignOut = async (req, res) => {
  if (!req.cookies.uid) {
    return res
      .status(403)
      .render('Error', { status: 403, message: 'bad request' });
  }

  res.clearCookie('uid');
  sessionManager.deleteSession(req.cookies.uid);
  res.status(200).send({ status: 200, message: 'Signed out successfully.' });
};

/**
 * @async
 * @function
 * Signs in the user, sets his cookies and creates his session
 *
 * @param {express.Request} req - Express Request object
 * @param {express.Response} res - Express Response object
 *
 * @returns {undefined} - redirects to the hompage or sends any errors if they
 * occurred
 */
exports.userSignIn = async (req, res) => {
  try {
    const user = await User.findOne(req.body);

    if (!user) {
      return res
        .status(401)
        .render('Error', { status: 401, message: 'Wrong credentials' });
    }

    let [sessionId, expiration] = await sessionManager.createSession(
      user._id.toString()
    );

    // set cookie
    res.cookie('uid', sessionId, {
      expire: expiration,
      secure: true,
      httpOnly: true,
    });

    res.status(201).redirect('/');
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
 * Renders the profile page
 *
 * @param {express.Request} req - Express Request object
 * @param {express.Response} res - Express Response object
 *
 * @returns {undefined} - Renders the profile page or sends any errors if they
 * occurred
 */
exports.getProfile = async (req, res) => {
  try {
    let profile = await User.findOne(req.params);

    if (!profile) {
      return res
        .status(404)
        .render('Error', { status: 404, message: 'User not found.' });
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

    res.render('Profile', { profile, user });
  } catch (error) {
    console.error(error);
  }
};

/**
 * @async
 * @function
 * Updates the currently logged-in user with the provided information.
 *
 * @param {express.Request} req - The request object containing the updated
 * user information.
 * @param {express.Response} res - The response object to send the updated
 * user information to the client.
 *
 * @returns {undefined} - This function will reroute to the homepage or
 * return an error response
 */
exports.updateUser = async (req, res) => {
  const { FullName, Email, Password, Country, DOB, StageName } = req.body;

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

    user.FullName = FullName;
    user.Email = Email;
    user.Password = Password;
    user.Country = Country;
    user.DOB = DOB;

    if (user.isArtist) {
      user.isArtist.StageName = StageName;
    }

    await user.save();

    res.status(204).redirect('/');
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).render('Error', {
        status: 409,
        message: 'Name or Email already exists',
      });
    } else {
      console.error(error);
      res
        .status(500)
        .render('Error', { status: 500, message: 'Internal sevrer error.' });
    }
  }
};

/**
 * @async
 * @function
 * Displays the discography page of an artist
 *
 * @param {express.Request} req - The request object containing the updated
 * artist Name.
 * @param {express.Response} res - The response object
 *
 * @returns {undefined} - This function will render the artist discography page
 * and displays any errors if they occur
 */
exports.getDiscography = async (req, res) => {
  const { StageName } = req.params;

  try {
    const user = await getLoggedInUser(req);

    // bad session id
    if (user === null) {
      res.clearCookie('uid');

      return res.status(500).render('Error', {
        status: 500,
        message: `user not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }

    const artist = await User.findOne({ isArtist: { StageName: StageName } });
    if (!artist) {
      return res
        .status(404)
        .render('Error', { status: 404, message: 'Artist not found.' });
    }

    const songs = await Song.find({ Artist: StageName });
    const albums = await Album.find({ Artist: StageName });

    const isThisArtist =
      user &&
      JSON.stringify(user.isArtist) !== '{}' &&
      user.isArtist.StageName === artist.isArtist.StageName;

    res
      .status(200)
      .render('Discography', { user, artist, songs, albums, isThisArtist });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};

exports.pfpUpload = async (req, res) => {
  try {
    if (!req.cookies.uid) {
      res.status(400).render('Error', { status: 400, message: 'Bad request.' });
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

    user.Avatar = `/uploads/${req.file.filename}`;

    await user.save();
    res.redirect(`/profiles/${user.FullName}`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};
