const express = require("express");
const {
  getOrder,
  createOrder,
  addOrder,
} = require("../controllers/orderController");

//const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

//router.use("/", validateToken);
router.route("/getorder/:id/:type").get(getOrder);
//router.route("/createorder").post(createOrder);
router.route("/addorder").post(createOrder);

module.exports = router;
