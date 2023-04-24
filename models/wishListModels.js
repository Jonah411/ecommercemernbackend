const mongoose = require("mongoose");

const wishListSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductDetails",
    required: true,
  },
  wishlist: {
    type: Number,
    default: () => 1,
  },
});

const WishList = mongoose.model("WishList", wishListSchema);
module.exports = WishList;
