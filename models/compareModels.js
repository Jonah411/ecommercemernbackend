const mongoose = require("mongoose");

const compareProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductDetails",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      image_name: {
        type: String,
      },
      price: {
        type: Number,
      },
      rating: {
        type: Number,
      },
      product_strength: {
        type: String,
      },
      pack_size: {
        type: Number,
      },
      categorie: {
        type: String,
      },
      brand: { type: String },
    },
  ],
});

const CompareProduct = mongoose.model("CompareProduct", compareProductSchema);
module.exports = CompareProduct;
