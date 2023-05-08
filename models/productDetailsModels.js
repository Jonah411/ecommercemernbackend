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
  variable_product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VariantsProduct",
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

const setProductPrice = function (next) {
  if (this.sale_price && this.sale_price_end && this.sale_price_start) {
    const currentDate = new Date();
    if (
      currentDate >= this.sale_price_start &&
      currentDate <= this.sale_price_end
    ) {
      this.price = this.sale_price;
    } else {
      this.price = this.regular_price;
    }
  } else {
    this.price = this.regular_price;
  }
  next();
};

ProductDetailsSchema.pre("save", setProductPrice);

const ProductDetails = mongoose.model("ProductDetails", ProductDetailsSchema);

module.exports = { ProductDetailsSchema, ProductDetails, setProductPrice };
