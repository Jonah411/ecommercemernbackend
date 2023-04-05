const express = require("express");
const {
  getRelatedProducts,
} = require("../controllers/relatedProductController");

const router = express.Router();

router.route("/:relatedProductId").get(getRelatedProducts);

module.exports = router;
