const express = require("express");
const {
  createCategorie,
  getParent,
  getCategories,
  getCategorie,
} = require("../controllers/categorieController");

const router = express.Router();

router.route("/").get(getCategories);
router.route("/add").post(createCategorie);
router.route("/parent").get(getParent);
router.route("/:id").get(getCategorie);

module.exports = router;
