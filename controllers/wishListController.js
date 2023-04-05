const asycHandler = require("express-async-handler");
const Product = require("../models/productModels");
const WishList = require("../models/wishListModels");

const createWishList = asycHandler(async (req, res) => {
  const { user, product, wishList } = req.body;
  let query = { user: user, product: product };
  const updateWishList = await WishList.findOne(query);
  if (!updateWishList) {
    const createWishlist = await WishList.create({
      user,
      product,
      wishList,
    });
    const wishlist = await WishList.find({
      user: user,
      wishlist: 1,
    }).populate({
      path: "product",
      select: "name price product_image",
    });
    return res.status(200).json({
      success: true,
      msg: `Added to your Wishlist successfully!`,
      wishlist: wishlist,
    });
  } else {
    const data = await WishList.findByIdAndUpdate(
      updateWishList._id,
      { wishlist: wishList },
      {
        new: true,
      }
    );
    const wishlist = await WishList.find({
      user: user,
      wishlist: 1,
    }).populate({
      path: "product",
      select: "name price product_image",
    });
    return res.status(200).json({
      success: true,
      msg: "Your Wishlist has been updated successfully!",
      wishlist: wishlist,
    });
  }
});

const getAllWishList = asycHandler(async (req, res) => {
  const id = req.params.id;

  const wishlist = await WishList.find({
    user: id,
    wishlist: 1,
  }).populate({
    path: "product",
    select: "name price product_image",
  });

  return res.status(200).json({ status: true, data: wishlist });
});

const getWishList = asycHandler(async (req, res) => {
  const userId = req.params.user_id;
  const productId = req.params.product_id;

  const wishlist = await WishList.find({
    user: userId,
    product: productId,
  }).populate({
    path: "product",
    select: "name price product_image",
  });

  return res.status(200).json({ status: true, data: wishlist });
});

module.exports = {
  createWishList,
  getAllWishList,
  getWishList,
};
