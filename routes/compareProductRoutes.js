const express = require("express");
const {
  getAllCompareList,
  createCompareList,
  removeCompareList,
} = require("../controllers/compareProductController");

const router = express.Router();

router
  .route("/:userId")
  .get(getAllCompareList)
  .post(createCompareList)
  .delete(removeCompareList);

module.exports = router;
