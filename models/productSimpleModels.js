const mongoose = require("mongoose");

const SimpleProductSchema = new mongoose.Schema({
  like_products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductDetails",
    },
  ],

  related_products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductDetails",
    },
  ],

  attributes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Attributes",
  },
  pack_size: {
    type: String,
    // required: true,
  },
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
  quantity_status: {
    type: String,
  },
  min_stock_quantity: {
    type: Number,
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
  },
});

const SimpleProduct = mongoose.model("SimpleProduct", SimpleProductSchema);

module.exports = SimpleProduct;
