const express = require('express');
const getLoggedInUser = require('../utils/getLoggedInUser');

/**
 * @async
 * @function
 * Render the homepage.
 *
 * @param {express.Request} req - The express request object
 * @param {express.Response} res - The express response object
 *
 * @returns {undefined} - This function will render a page or return an error response
 */
exports.getHomePage = async (req, res) => {
  try {
    let user = await getLoggedInUser(req);

    // bad session id
    if (user === null) {
      res.clearCookie('uid');

      return res.status(500).send({
        status: 500,
        message: `user not found with id ${req.cookies.uid}. Please refresh.`,
      });
    }
    res.render('Homepage', { user });
  } catch (err) {
    // Handle any error that occurred in the query
    console.error(err);
    res.status(500).send({
      status: 500,
      message: `Internal server occurred`,
    });
  }
};
