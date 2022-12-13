const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Artist: {
    type: String,
    required: true,
  },
  Album: String,
  ReleaseDate: { type: Date, required: true },
  Genres: { type: [String], required: true },
  Length: { type: Number, required: true },
  Features: [String],
  AlbumPosition: Number,
  PreviewUrl: String,
  Cover: { type: String, required: true },
  Links: [String],
});

module.exports = mongoose.model('Song', songSchema);
