const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  rating_value: {
    type: Number,
    required: true,
  },
  review_description: {
    type: String,
    required: true,
  },
  review_title: {
    type: String,
    required: false,
  },
  review_username: {
    type: String,
    required: true,
  },
  review_image: [
    {
      type: String,
      required: false,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
