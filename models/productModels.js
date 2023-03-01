const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add the product name"],
  },
  description: {
    type: String,
    required: [true, "Please add the product description"],
  },
  product_image: {
    type: String,
    required: [true, "Please add the product image"],
  },
  product_gallery: {
    type: [String],
    required: [true, "Please add the product image gallery"],
  },
  price: {
    type: Number,
    required: [true, "Please add the product price"],
  },
  rating_star: {
    type: Number,
  },
  wishlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WishList",
    required: false,
  },
  categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categorie",
    required: [true, "Please add the categorie"],
  },
  brands: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
