const express = require("express");
const {
  getProducts,
  createProduct,
  getAllProducts,
} = require("../controllers/productController");

const router = express.Router();

//router.use(validateToken);
router.route("/:id/:type/:user?").get(getProducts);
router.route("/").get(getAllProducts);
router.route("/create").post(createProduct);

module.exports = router;
