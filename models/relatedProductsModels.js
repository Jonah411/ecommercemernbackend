const mongoose = require("mongoose");

const relatedProductSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  product_list: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
  },
});

const RelatedProduct = mongoose.model("RelatedProduct", relatedProductSchema);

module.exports = RelatedProduct;
