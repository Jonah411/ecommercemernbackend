const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModels");
const Product = require("../models/productModels");
const { calculateTotalPrice } = require("../utills/CalculatePrice");
const ProductDetails = require("../models/productDetailsModels");

const getAllUserCart = asyncHandler(async (req, res) => {
  const user = req.params.id;
  Cart.findOne({ user: user })
    .populate("items.product", "name price product_image")
    .exec()
    .then(async (carts) => {
      const subtotalPrice = await calculateTotalPrice(user);
      return res.status(200).json({
        message: "Carts retrieved successfully",
        carts: carts,
        totalPrice: subtotalPrice,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Cart retrieval failed",
        error: error,
      });
    });
});

const createCart = asyncHandler(async (req, res) => {
  try {
    const { user, items } = req.body;
    const productId = items[0].product._id;
    const quantity = items[0].quantity;

    Cart.findOne({ user: user })
      .populate("items.product", "name price product_image")
      .exec(async (err, cart) => {
        if (err) {
          console.error(err);
          return;
        }

        if (!cart) {
          cart = new Cart({
            user: user,
            items: [],
            subtotalprice: 0,
          });
        }

        const itemIndex = cart.items.findIndex(
          (item) =>
            item.product &&
            item.product._id &&
            item.product._id.toString() === productId
        );

        if (itemIndex === -1) {
          const product = await ProductDetails.findById(productId);

          const productprice = product.price;
          cart.items.push({ product: productId, quantity, productprice });
        } else {
          cart.items[itemIndex].quantity += quantity;
        }

        cart.items = cart.items.filter((item) => item.product);

        const totalPrice = await calculateTotalPrice(user.toString());
        if (isNaN(totalPrice)) {
        } else {
          cart.subtotalprice = totalPrice.toFixed(2);
          cart.totalprice = totalPrice.toFixed(2);
        }

        await cart.save();

        return res.status(201).json({
          status: true,
          message: "Cart added successfully",
          cart: cart,
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

const getCartProducts = asyncHandler(async (req, res) => {
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

const deleteCart = asyncHandler(async (req, res) => {
  Cart.deleteMany({})
    .then((result) => {
      console.log(`Deleted ${result.deletedCount} documents`);
    })
    .catch((err) => {
      console.error(`Error deleting documents: ${err}`);
    });
});

const singleDeleteCart = asyncHandler(async (req, res) => {
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

const updateCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const newItems = req.body.items;
    // Find the cart item using the user's ID and the product's ID, and update the quantity
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { items: newItems },
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
