const express = require("express");
const {
  getAllUserCart,
  createCart,
  getCartProducts,
  deleteCart,
  singleDeleteCart,
  updateCart,
} = require("../controllers/cartController");
//const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

//router.use("/", validateToken);
router.route("/getcart/:id").get(getAllUserCart);
router.route("/:id").get(getCartProducts);
router.route("/addcart").post(createCart);
router.route("/deletecart").delete(deleteCart);
router.route("/singledelete").post(singleDeleteCart);
router.route("/:userId/:productId").put(updateCart);

module.exports = router;
