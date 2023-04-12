const mongoose = require("mongoose");

const GroupedProductSchema = new mongoose.Schema({
  group_products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductDetails",
    },
  ],
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

  sku: {
    type: String,
    // required: true,
  },
});

const GroupedProduct = mongoose.model("GroupedProduct", GroupedProductSchema);

module.exports = GroupedProduct;
