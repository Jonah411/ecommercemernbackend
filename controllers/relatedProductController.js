const asyncHandler = require("express-async-handler");
const Product = require("../models/productModels");
const RelatedProduct = require("../models/relatedProductsModels");

const createRelated = async (id, data) => {
  try {
    const result = await RelatedProduct.findOneAndUpdate(
      { product: id },
      { $push: { product_list: data } },
      { upsert: true, new: true }
    );
    console.log("Related product created:", result);
    return result._id;
  } catch (err) {
    console.error(err);
  }
};
const getRelatedProducts = asyncHandler(async (req, res) => {
  const relatedId = req.params.relatedProductId;

  const relatedProduct = await RelatedProduct.findOne({
    _id: relatedId,
  }).populate("product_list");
  return res.status(200).json({
    status: true,
    data: relatedProduct,
  });
});

module.exports = { createRelated, getRelatedProducts };
