const express = require('express');
const sessionManager = require('../config/session.config');
const User = require('../models/user.module');

/**
 * @async
 * @function
 * Gets the currently logged-in user based on the session ID in the provided
 * request.
 *
 * @param {express.Request} req - The request object containing the session ID
 *  cookie.
 * @returns {Promise.<(User|null)>} The user object, or null if no user is
 * logged in or the session ID is invalid.
 */
const getLoggedInUser = async (req) => {
  const userId = req.cookies.uid
    ? await sessionManager.getUserId(req.cookies.uid)
    : false;

  // bad session id
  if (userId === null) {
    return null;
  }

  return !userId ? 0 : await User.findById(userId);
};

module.exports = getLoggedInUser;
