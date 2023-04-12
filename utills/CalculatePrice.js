const Cart = require("../models/cartModels");
const mongoose = require("mongoose");
const ProductDetails = require("../models/productDetailsModels");

const calculateTotalPrice = async (userId) => {
  const pipeline = [
    {
      $match: { user: mongoose.Types.ObjectId(userId) },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: ProductDetails.collection.name,
        localField: "items.product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $addFields: {
        productTotal: {
          $multiply: ["$product.price", "$items.quantity"],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalPrice: {
          $sum: "$productTotal",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalPrice: 1,
      },
    },
  ];
  try {
    const result = await Cart.aggregate(pipeline);
    return parseFloat(Number(result[0]?.totalPrice.toFixed(2)));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = { calculateTotalPrice };
