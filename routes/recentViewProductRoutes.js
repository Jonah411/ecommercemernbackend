const express = require("express");
const {
  getLatestReviewProducts,
} = require("../controllers/recentViewProductController");

const router = express.Router();

router.route("/:userId").get(getLatestReviewProducts);

module.exports = router;
