const ProductDetails = require("../models/productDetailsModels");

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
      this.sale_price = null;
    }
  } else {
    this.price = this.regular_price;
    this.sale_price = null;
  }
  next();
};

ProductDetails.pre("save", setProductPrice);

module.exports = { ProductDetails, setProductPrice };
