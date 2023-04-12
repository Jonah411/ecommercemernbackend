const mongoose = require("mongoose");

const SimpleProductSchema = new mongoose.Schema({
  like_products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductDetails",
    },
  ],
  pack_size: {
    type: String,
    // required: true,
  },

  related_products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductDetails",
    },
  ],

  sku: {
    type: String,
    // required: true,
  },
  stock_status: {
    type: String,
    enum: ["In Stock", "Out of Stock", "On Backorder"],
    default: "In Stock",
  },
  strength: {
    type: String,
    // required: true,
  },
});

const SimpleProduct = mongoose.model("SimpleProduct", SimpleProductSchema);

module.exports = SimpleProduct;
