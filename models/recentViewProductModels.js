const mongoose = require("mongoose");

const recentViewProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
  ],
});

const RecentViewProduct = mongoose.model(
  "RecentViewProduct",
  recentViewProductSchema
);

module.exports = RecentViewProduct;
