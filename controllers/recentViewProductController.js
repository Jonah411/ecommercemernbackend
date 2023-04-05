const asyncHandler = require("express-async-handler");
const RecentViewProduct = require("../models/recentViewProductModels");
const Product = require("../models/productModels");

const createReview = async (id, user) => {
  if (user) {
    try {
      await RecentViewProduct.findOneAndUpdate(
        { userId: user },
        { $push: { products: id } },
        { upsert: true, new: true }
      );
      console.log("Recent view product added:");
    } catch (err) {
      console.error(err);
    }
  }
};
const getLatestReviewProducts = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const recentViewProducts = await RecentViewProduct.findOne({
    userId: userId,
  }).populate("products");
  return res.status(200).json({
    status: true,
    data: recentViewProducts ? recentViewProducts : { products: [] },
  });
});
module.exports = { createReview, getLatestReviewProducts };
