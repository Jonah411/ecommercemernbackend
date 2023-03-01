const asycHandler = require("express-async-handler");
const Cart = require("../models/cartModels");
const Order = require("../models/orderModels");
const { calculateTotalPrice } = require("../utills/CalculatePrice");

const getOrder = asycHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const orderType = req.params.type;
    Order.find({ user: userId, status: orderType })
      .populate("items.product", "name price product_image")
      .exec()
      .then(async (order) => {
        return res.status(201).json({
          status: true,
          message: "Order added successfully",
          order: order,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: "order retrieval failed",
          error: error,
        });
      });
    // const order = await Order.find({ user: userId, status: orderType });
    // return res.status(201).json({
    //   status: true,
    //   message: "Order added successfully",
    //   order: order,
    // });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const createOrder = asycHandler(async (req, res) => {
  try {
    const { user, items, totalPrice } = req.body;
    const order = await Order.create({ user, items, totalPrice });
    if (order) {
      await Cart.deleteOne({ user: user });
    }
    return res.status(201).json({
      status: true,
      message: "Order added successfully",
      order: order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { getOrder, createOrder };
