const express = require("express");
const {
  getCategories,
  createCategories,
  updateCategories,
  deleteCategories,
} = require("../controllers/categoriesController");
const {
  createRolls,
  createMenus,
  getMenu,
  getRolls,
  getRollMenus,
  deleteMenu,
} = require("../controllers/commonController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

//router.use(validateToken);
router.route("/roll").post(createRolls).get(getRolls);
router.route("/menu").post(createMenus);
router.route("/menu/delete").post(deleteMenu);
router.route("/menu/roll/:id").get(getRollMenus);
router.route("/menu/:user_id").get(getMenu);
router.route("/categories").get(getCategories).post(createCategories);
router.route("/categories/:id").put(updateCategories).delete(deleteCategories);

module.exports = router;
