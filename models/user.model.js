const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: true,
      unique: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => {
          return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
          );
        },
        message: 'Not a valid email!',
      },
    },
    Password: {
      type: String,
      required: true,
    },
    Country: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    Avatar: {
      type: String,
      required: true,
    },
    isArtist: {
      StageName: { type: String, unique: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
