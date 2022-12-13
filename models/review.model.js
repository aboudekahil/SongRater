const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    Content: {
      type: String,
      required: true,
    },
    Stars: {
      type: Number,
      required: true,
    },
    Song: {
      type: String,
      required: true,
    },
    Artist: {
      type: String,
      required: true,
    },
    User: {
      type: String,
      required: true,
    },
    Avatar: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
