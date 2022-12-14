const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
  loginCount: {
    type: Number,
    required: true,
    default: 1
  },
});

module.exports = mongoose.model('Session', sessionSchema);
