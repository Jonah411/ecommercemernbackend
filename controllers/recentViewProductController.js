const asyncHandler = require("express-async-handler");
const RecentViewProduct = require("../models/recentViewProductModels");
const Product = require("../models/productModels");
const { ProductDetails } = require("../models/productDetailsModels");

const createReview = async (id, user) => {
  if (user) {
    try {
      await RecentViewProduct.findOneAndUpdate(
        { userId: user, products: { $ne: id } }, // Use $ne to check if product is not already present in the array
        { $addToSet: { products: id } }, // Use $addToSet to add product only if it doesn't already exist in the array
        { upsert: true, new: true }
      ).lean();
    } catch (err) {
      console.error(err);
    }
  }
};
const getLatestReviewProducts = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const recentViewProducts = await RecentViewProduct.findOne({
    userId: userId,
  });

  // Declare recentData array outside the loop
  const recentData = [];

  // Use forEach to iterate over recentViewProducts.products
  await Promise.all(
    recentViewProducts.products.map(async (data) => {
      const recentFilter = await ProductDetails.findById(data);

      recentData.push(recentFilter);
    })
  );

  return res.status(200).json({
    status: true,
    data: recentData ? recentData : { products: [] },
  });
});
module.exports = { createReview, getLatestReviewProducts };
