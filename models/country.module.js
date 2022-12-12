const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    unique: true,
  },
  Abbr: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Country', countrySchema);
