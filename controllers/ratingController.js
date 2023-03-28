const asyncHandler = require("express-async-handler");
const reviewsHandler = require("../helpers/reviewUpload");
const Product = require("../models/productModels");
const Rating = require("../models/ratingModels");

const parseJson = (data) => {
  let field = "json_data";
  var value;
  if (data[field] && typeof data[field] === "string") {
    value = JSON.parse(data[field]);
  }
  return value;
};

const createRating = asyncHandler(async (req, res) => {
  reviewsHandler(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ status: false, message: err.message });
    }

    const confiq = parseJson(req.body);
    const files = req.files;
    const reviewImage = [];
    files.forEach((data) => {
      reviewImage.push(data?.path);
    });

    try {
      const product = await Product.findById(confiq.productId)
        .populate("rating_star.rating")
        .exec();

      if (!product) {
        return res
          .status(404)
          .json({ status: false, msg: "Product not found" });
      }

      const rating = await Rating.create({
        rating_value: confiq.rate_product,
        review_description: confiq.review_description,
        review_title: confiq.review_title,
        review_username: confiq.review_username,
        review_image: req.files ? reviewImage : null,
      });

      product.rating_star.rating.push(rating._id);
      const savedProduct = await product.save();

      let totalRating = 0;
      for (let i = 0; i < savedProduct.rating_star.rating.length; i++) {
        if (savedProduct.rating_star.rating[i].rating_value) {
          totalRating += savedProduct.rating_star.rating[i].rating_value;
        } else {
          totalRating += rating.rating_value;
        }
      }

      const averageRating =
        totalRating / savedProduct.rating_star.rating.length;

      const updatedProduct = await Product.findByIdAndUpdate(
        confiq.productId,
        { $set: { "rating_star.rating_radio": averageRating } },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(400).json({ status: false, data: "" });
      }

      return res.status(200).json({
        status: true,
        data: updatedProduct,
        msg: "Rating And Reviews added successfully",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, msg: "Internal server error" });
    }
  });
});

const getRating = asyncHandler(async (req, res) => {
  const productId = req.params.id;
});

module.exports = { createRating, getRating };
