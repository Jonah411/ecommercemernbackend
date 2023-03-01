const express = require("express");
const {
  getAllAddress,
  createAddress,
  updateAddress,
} = require("../controllers/addressController");

const router = express.Router();

router.route("/:id").get(getAllAddress).post(createAddress).put(updateAddress);

module.exports = router;
