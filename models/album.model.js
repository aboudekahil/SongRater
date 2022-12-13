const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Artist: {
      type: String,
      required: true,
    },
    ReleaseDate: { type: Date, required: true },
    NumberOfSongs: { type: Number, required: true },
    Genres: { type: [String], required: true },
    Length: { type: Number, required: true },
    Features: [String],
    Cover: { type: String, required: true },
    Links: [String],
  }
);

module.exports = mongoose.model('Album', albumSchema);
