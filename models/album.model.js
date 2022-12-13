const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Artist: {
    type: String,
    required: true,
  },
  ReleaseDate: { type: Date, required: true },
  Cover: { type: String, required: true },
  Links: [String],
});

module.exports = mongoose.model('Album', albumSchema);
