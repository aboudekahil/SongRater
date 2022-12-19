const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  Owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  Name: {
    type: String,
    required: true,
  },
  Songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    },
  ],
});

playlistSchema.index({ Name: 1, Owner: 1 }, { unique: true });

module.exports = mongoose.model('Playlist', playlistSchema);
