const express = require("express");
const {
  getProductTypes,
  createProductTypes,
  createProduct,
  getAllProductDetails,
  updateProduct,
  dropProductDetails,
} = require("../controllers/productDetailsController");
const {
  createVariableProductsVariants,
  getVariableProduct,
  getVariantsProduct,
  updateVariantsProductDetails,
} = require("../controllers/variableProductController");

const router = express.Router();

//router.use(validateToken);
router.route("/product_types").get(getProductTypes).post(createProductTypes);
router.route("/create_product").post(createProduct);
router.route("/update_product").put(updateProduct);
router.route("/drop_product/:productId").delete(dropProductDetails);
router.route("/product").get(getAllProductDetails);
router.route("/create_variable").post(createVariableProductsVariants);
router.route("/get_variable/:ids").get(getVariableProduct);
router.route("/get_variants/:ids").get(getVariantsProduct);
router.route("/update_product/:id").post(updateVariantsProductDetails);
module.exports = router;
