const express = require("express");
const { currentUser } = require("../controllers/userController");
const {
  createWishList,
  getAllWishList,
  getWishList,
} = require("../controllers/wishListController");

//const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

//router.use("/", validateToken);
router.route("/add").post(createWishList);
router.route("/product/:id").get(getAllWishList);
router.route("/:user_id/:product_id").get(getWishList);

module.exports = router;
