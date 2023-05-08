const mongoose = require("mongoose");

const externalProductSchema = new mongoose.Schema({
  external_link: {
    type: String,
  },
  external_btn: {
    type: String,
  },
  sku: {
    type: String,
  },
  strength: {
    type: String,
  },
  pack_size: {
    type: String,
  },
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
});

const ExternalProduct = mongoose.model(
  "ExternalProduct",
  externalProductSchema
);

module.exports = ExternalProduct;
