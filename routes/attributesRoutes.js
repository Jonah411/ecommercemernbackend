const express = require("express");
const {
  getAttributes,
  createAttributes,
  deleteAttributes,
} = require("../controllers/attributesController");

const router = express.Router();

router.route("/:ids").get(getAttributes);
router.route("/:id").post(createAttributes).delete(deleteAttributes);

module.exports = router;
