const express = require("express");
const {
  getProductTypes,
  createProductTypes,
  createProduct,
  getAllProductDetails,
  updateProduct,
  dropProductDetails,
} = require("../controllers/productDetailsController");

const router = express.Router();

//router.use(validateToken);
router.route("/product_types").get(getProductTypes).post(createProductTypes);
router.route("/create_product").post(createProduct);
router.route("/update_product").put(updateProduct);
router.route("/drop_product/:productId").delete(dropProductDetails);
router.route("/product").get(getAllProductDetails);
module.exports = router;
