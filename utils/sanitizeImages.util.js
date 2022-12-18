const fs = require('fs');
const path = require('path');
const logger = require('../config/logger.config');
const User = require('../models/user.model');
const Song = require('../models/song.model');
const Album = require('../models/album.model');

/**
 * @async
 * @function
 * Sanitizes images stored in the './public/uploads/' directory by deleting any images
 * that are not used in the database.
 */
const sanitizeImages = async () => {
  try {
    let imagesDir = await fs.promises.readdir('./public/uploads/');

    let imagesDb = await User.find({}).distinct('Avatar');
    imagesDb.push(...(await Song.find({}).distinct('Cover')));
    imagesDb.push(...(await Album.find({}).distinct('Cover')));

    imagesDb = imagesDb.filter((image) => image[0] === '/');

    let toDelete = imagesDir.filter(
      (image) => !imagesDb.includes(`/uploads/${image}`)
    );

    toDelete.forEach(async (imageName) => {
      await fs.promises.unlink(`./public/uploads/${imageName}`);
      logger.info(`Deleted ${imageName} from server`);
    });
  } catch (error) {
    logger.error('Error in sanitize image method - ', error);
  }
};

module.exports = sanitizeImages;
