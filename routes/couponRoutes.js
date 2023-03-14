const express = require("express");
const { applyCoupon } = require("../controllers/couponController");

//const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

//router.use("/", validateToken);
router.route("/").post(applyCoupon);

module.exports = router;
