const asycHandler = require("express-async-handler");
const Cart = require("../models/cartModels");
const Product = require("../models/productModels");
const { calculateTotalPrice } = require("../utills/CalculatePrice");

const getAllUserCart = asycHandler(async (req, res) => {
  const user = req.params.id;
  Cart.findOne({ user: user })
    .populate("items.product", "name price product_image")
    .exec()
    .then(async (carts) => {
      const totalPrice = await calculateTotalPrice(user);
      return res.status(200).json({
        message: "Carts retrieved successfully",
        carts: carts,
        totalPrice: totalPrice,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Cart retrieval failed",
        error: error,
      });
    });
});

const createCart = asycHandler(async (req, res) => {
  try {
    const { user, items } = req.body;
    const productId = items[0].product._id;
    const quantity = 1;
    // const cartData = await Cart.findOne({
    //   "items.product": items[0].product._id,
    // });
    // find the cart for the user
    Cart.findOne({ user: user })
      .populate("items.product", "name price product_image")
      .exec(async (err, cart) => {
        if (err) {
          console.error(err);
          return;
        }

        if (!cart) {
          // create a new cart if one doesn't exist for the user
          cart = new Cart({
            user: user,
            items: [],
          });
        }

        // check if the product already exists in the cart
        const itemIndex = cart.items.findIndex(
          (item) => item.product._id.toString() === productId
        );

        if (itemIndex === -1) {
          // add a new item to the cart if the product isn't already in it
          cart.items.push({ product: productId, quantity });
        } else {
          // update the quantity of the existing item if the product is already in the cart
          cart.items[itemIndex].quantity += quantity;
        }

        // save the updated cart
        await cart.save();

        // assuming you have middleware to extract the user ID from the request
        const totalPrice = await calculateTotalPrice(user);
        return res.status(201).json({
          status: true,
          message: "Cart added successfully",
          totalPrice: totalPrice,
        });
      });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// if (!cartData) {
//   const cart = await Cart.create({
//     user: user,
//     items: items,
//   });
//   return res.status(201).json({
//     status: true,
//     message: "Cart created successfully",
//   });
// } else {
//   return res.status(200).json({
//     status: false,
//     message: "Cart alread created",
//   });
// }

const getCartProducts = asycHandler(async (req, res) => {
  const productid = req.params.id;
  Product.findById(productid)
    .select("name price product_image")
    .exec(function (err, product) {
      if (err) {
        return res
          .status(500)
          .json({ status: false, message: "Error retrieving product" });
      }
      if (!product) {
        return res
          .status(404)
          .json({ status: false, message: "Product not found" });
      }
      return res.status(200).json({ status: true, data: product });
    });
});

const deleteCart = asycHandler(async (req, res) => {
  Cart.deleteMany({})
    .then((result) => {
      console.log(`Deleted ${result.deletedCount} documents`);
    })
    .catch((err) => {
      console.error(`Error deleting documents: ${err}`);
    });
});

const singleDeleteCart = asycHandler(async (req, res) => {
  const { productid, userid } = req.body;
  Cart.findOneAndUpdate(
    { user: userid },
    { $pull: { items: { product: productid } } },
    { new: true },
    (err, cart) => {
      if (err) {
        console.error(err);
        return;
      }

      return res
        .status(200)
        .json({ status: true, message: `Deleted cart Successfully` });
    }
  );
});

const updateCart = asycHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;
    const newQuantity = req.body.quantity; // Get the new quantity from the request body

    // Find the cart item using the user's ID and the product's ID, and update the quantity
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId, "items.product": productId },
      { $set: { "items.$.quantity": newQuantity } },
      { new: true } // Return the updated document
    );

    if (!updatedCart) {
      return res.status(201).json({
        status: true,
        message: "Cart item not found",
      });
      //return res.status(404).json({ message: "Cart item not found" });
    }
    const totalPrice = await calculateTotalPrice(userId);
    return res.status(201).json({
      status: true,
      message: "Cart Update successfully",
      totalPrice: totalPrice,
    });
  } catch (err) {
    return res.status(201).json({
      status: true,
      message: "Server error",
    });
    //res.status(500).json({ message: "Server error" });
  }
});

module.exports = {
  getAllUserCart,
  createCart,
  getCartProducts,
  deleteCart,
  singleDeleteCart,
  updateCart,
};
