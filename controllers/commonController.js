const asycHandler = require("express-async-handler");
const Menu = require("../models/menuModels");
const Roll = require("../models/rollModels");
const User = require("../models/userModels");

const createRolls = async (req, res) => {
  const rolls = [{ name: "admin" }, { name: "user" }, { name: "developer" }];

  Roll.create(rolls, (error, rolls) => {
    if (error) {
      console.log(error);
    } else {
      res.status(200).json(rolls);
    }
  });
};

const getRolls = async (req, res) => {
  const roll = await Roll.find({});
  return res.status(201).json({
    status: true,
    message: "Get All Rolls successfully",
    data: roll,
  });
};

const createMenus = async (req, res) => {
  //   const menus = [
  //     { name: "Order History" },
  //     { name: "Wish List" },
  //     { name: "Payment" },
  //   ];
  const { roll, menu_name } = req.body;
  Roll.findOne({ _id: roll }, (error, roll) => {
    if (error) {
      console.log(error);
    } else {
      const newMenu = Menu({
        roll_id: roll._id,
        name: menu_name,
        status: 1,
      });
      newMenu.save((error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("menu created successfully!");
        }
      });
      Menu.find({}, (error, menus) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(201).json({
            status: true,
            data: { _id: menus.id, name: menus.name },
            message: "menu created successfully!",
          });
        }
      });
    }
  });
};

const getMenu = async (req, res) => {
  const userId = req.params.user_id;

  User.findOne({ _id: userId }, function (err, foundData) {
    Menu.find({ roll_id: foundData?.roll_id }, function (err, foundData) {
      if (err) return handleError(err);
      return res.status(201).json({ msg: foundData });
    });
  });
};

const deleteMenu = async (req, res) => {
  try {
    const { menuId } = req.body;
    const deletedMenu = await Menu.findOneAndDelete({ _id: menuId });
    if (!deletedMenu) {
      return res.status(404).send({ error: "Menu not found" });
    }
    return res.status(201).json({
      status: true,
      message: "menu delete successfully!",
    });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};

const getRollMenus = async (req, res) => {
  const rollId = req.params.id;
  const menu = await Menu.find({ roll_id: rollId });
  return res.status(201).json({
    status: true,
    message: "Get All Rolls successfully",
    data: menu,
  });
};

module.exports = {
  createRolls,
  createMenus,
  getMenu,
  getRolls,
  getRollMenus,
  deleteMenu,
};
