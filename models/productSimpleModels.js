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
  stock_quantity: {
    type: Number,
  },
  manage_stock: {
    type: Boolean,
    default: () => false,
  },
  sold_individually: {
    type: Boolean,
    default: () => false,
  },
  backorders_status: {
    type: String,
    enum: ["Do Not Allow", "Allow, but notify customers", "Allow", ""],
    default: "Do Not Allow",
  },
  stock_threshold: {
    type: Number,
  },
  stock_status: {
    type: String,
    enum: ["In Stock", "Out of stock", "On Backorder", ""],
    default: "In Stock",
  },
  strength: {
    type: String,
    // required: true,
  },
});

const SimpleProduct = mongoose.model("SimpleProduct", SimpleProductSchema);

module.exports = SimpleProduct;
