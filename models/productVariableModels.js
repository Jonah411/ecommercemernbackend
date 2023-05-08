const mongoose = require("mongoose");

const VariableProductSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  description: {
    type: String,
  },
  regular_price: {
    type: Number,
  },
  sale_price: {
    type: Number,
  },
  sale_price_end: {
    type: Date,
  },
  sale_price_start: {
    type: Date,
  },
  product_image: {
    type: String,
  },
  product_gallery: {
    type: [String],
  },
  sku: {
    type: String,
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
  pack_size: {
    type: String,
    // required: true,
  },
  defaultvariant: [
    {
      default_value_variant: {
        type: String,
      },
    },
  ],
});

const VariableProduct = mongoose.model(
  "VariableProduct",
  VariableProductSchema
);

module.exports = VariableProduct;
