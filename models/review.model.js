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
      Name: {
        type: String,
        required: true,
      },
      Artist: {
        type: String,
        required: true,
      },
    },
    User: {
      Avatar: {
        type: String,
        required: true,
      },
      Name: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
