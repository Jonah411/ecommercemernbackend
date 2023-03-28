const express = require("express");
const { createRating, getRating } = require("../controllers/ratingController");

const router = express.Router();

//router.use(validateToken);
router.route("/product").post(createRating);
router.route("/product").get(getRating);

module.exports = router;
