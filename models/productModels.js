const mongoose = require("mongoose");
const RelatedProduct = require("./relatedProductsModels");

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
  },
  product_strength: {
    type: String,
  },
  pack_size: {
    type: Number,
  },
  rating_star: {
    rating: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
    rating_radio: {
      type: Number,
      default: () => 0,
    },
  },
  wishlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WishList",
    required: false,
  },
  categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categorie",
  },
  brands: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  related_products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RelatedProduct",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
