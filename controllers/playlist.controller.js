const Song = require('../models/song.model');
const logger = require('../config/logger.config');
const getLoggedInUser = require('../utils/getLoggedInUser.util');
const Playlist = require('../models/playlist.model');
const User = require('../models/user.model');

/**
 * @async
 * @function
 * This function adds a song to a playlist for a logged-in user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {undefined} Redirects to the previous page with a status message
 */
exports.addSongToPlaylist = async (req, res) => {
  const { Name, Artist, PlaylistName } = req.body;
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

    let playlist = await Playlist.findOne({
      Owner: user._id,
      Name: PlaylistName,
    });

    if (!playlist) {
      return res.status(404).render('Error', {
        status: 404,
        message: `No playlist with the name ${PlaylistName}`,
      });
    }

    const song = await Song.findOne({ Name, Artist });

    if (!song) {
      return res.status(404).send({ status: 404, message: 'Song not found' });
    }

    playlist.Songs.push(song);

    await playlist.save();
    res.status(200).redirect('back');
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
 * This function removes a song to a playlist for a logged-in user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {undefined} Redirects to the previous page with a status message
 */
exports.removeSongFromPlaylist = async (req, res) => {
  const { Name, Artist, PlaylistName } = req.body;

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

    let playlist = await Playlist.findOne({
      Owner: user._id,
      Name: PlaylistName,
    });

    if (!playlist) {
      return res.status(404).render('Error', {
        status: 404,
        message: `No playlist with the name ${PlaylistName}`,
      });
    }

    const song = await Song.findOne({ Name, Artist });

    if (!song) {
      return res.status(404).send({ status: 404, message: 'Song not found' });
    }

    const index = playlist.Songs.indexOf(song._id);

    if (index === -1) {
      return res
        .status(403)
        .send(`bad request, ${Name} does not exist in this playlist`);
    }

    playlist.Songs.splice(index, 1);

    await playlist.save();
    res.status(200).redirect('back');
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
 * This function creates a playlist for a logged-in user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {undefined} Redirects to the previous page with a status message
 */
exports.createPlaylist = async (req, res) => {
  const { Name } = req.body;
  console.log(Name);

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

    let playlist = new Playlist({ Name, Owner: user._id });

    await playlist.save();
    res
      .status(200)
      .send({ status: 200, message: 'Successfully created playlist' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).render('Error', {
        status: 409,
        message: 'You already have a playlist of that name',
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
 * This function deletes a playlist for a logged-in user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {undefined} Redirects to the previous page with a status message
 */
exports.deletePlaylist = async (req, res) => {
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

    let playlist = await Playlist.findOne({ Name, Owner: user._id });
    await playlist.remove();
    res.status(200).redirect('back');
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
 * This function gets a users playlist.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {undefined} Redirects to the previous page with a status message
 */
exports.getUserPlaylists = async (req, res) => {
  const { SongName, Checkboxes } = req.body;
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

    let playlists = await Playlist.find({ Owner: user._id });
    let song = await Song.findOne({ Name: SongName });

    if (Checkboxes) {
      playlists = playlists
        .map((playlist) => {
          return `<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" ${
    song && playlist.Songs.includes(song._id) ? 'checked' : ''
  }>
  <label class="form-check-label" for="flexCheckDefault">
    ${playlist.Name}
  </label>
</div>`;
        })
        .join('');
    }

    res.status(200).send({ data: playlists });
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
 * This function gets a users playlist page.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {undefined} Renders the playlist page.
 */
exports.getPlaylistPage = async (req, res) => {
  const { Name, FullName } = req.params;

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

    const userPlaylist = await User.findOne({ FullName });

    if (!userPlaylist) {
      return res.status(404).render('Error', {
        status: 404,
        message: `No user with name ${FullName}`,
      });
    }

    const playlist = await Playlist.findOne({ Name, Owner: userPlaylist._id });
    let songs = await Promise.all(
      playlist.Songs.map(async (s) => {
        return await Song.findById(s);
      })
    );

    res.status(200).render('Playlist', { playlist, songs, user });
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
 * This function gets a users playlists list.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {undefined} Renders the playlists page.
 */
exports.getPlaylistsPage = async (req, res) => {
  const { FullName } = req.params;

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

    const userPlaylist = await User.findOne({ FullName });

    if (!userPlaylist) {
      return res.status(404).render('Error', {
        status: 404,
        message: `No user with name ${FullName}`,
      });
    }

    const playlists = await Playlist.find({ Owner: userPlaylist._id });

    res
      .status(200)
      .render('Playlists', { playlists, FullName, userPlaylist, user });
  } catch (error) {
    logger.error(`${__filename} -`, error);
    res
      .status(500)
      .render('Error', { status: 500, message: 'Internal server error.' });
  }
};
