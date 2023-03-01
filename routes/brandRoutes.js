const express = require("express");
const {
  getAllBrands,
  createBrands,
  getBrand,
  getBrandBanner,
  updateBanner,
  getActiveBanner,
} = require("../controllers/brandController");

const router = express.Router();

router.route("/").get(getAllBrands);
router.route("/allbanner").get(getBrandBanner);
router.route("/activebanner").get(getActiveBanner);
router.route("/add").post(createBrands);
router.route("/update/:id").put(updateBanner);
router.route("/:id").get(getBrand);

module.exports = router;
