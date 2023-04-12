const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductDetails",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      productprice: {
        type: Number,
        required: true,
      },
    },
  ],
  totalprice: {
    type: Number,
    default: 0,
    required: true,
  },
  subtotalprice: {
    type: Number,
    default: 0,
    required: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
