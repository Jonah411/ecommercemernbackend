const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  currentUser,
  refreshUser,
  updateRollUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.get("/", validateToken);
router.get("/allusers", getUsers);
router.get("/:id", currentUser);
router.route("/register").post(createUser);
router.route("/changeroll").post(updateRollUser);
router.route("/login").post(loginUser);
router.route("/:id").get(getUser).put(updateUser).post(deleteUser);
router.route("/refresh").post(refreshUser);
module.exports = router;
