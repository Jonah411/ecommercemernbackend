const mongoose = require("mongoose");

const ProductDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  short_description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    // required: true,
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
  productType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductTypes",
    required: true,
  },
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categorie",
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  simple_product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SimpleProduct",
  },
  group_product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupedProduct",
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
  date: {
    type: Date,
    default: Date.now,
  },
  update_date: {
    type: Date,
    default: Date.now,
  },
});

const ProductDetails = mongoose.model("ProductDetails", ProductDetailsSchema);
module.exports = ProductDetails;
