const asycHandler = require("express-async-handler");
const { nameCheck } = require("../helpers/validationUser");
const Categorie = require("../models/categorieModels");

//@desc Get all categories
//@route Get /api/dashboard/categories
//@access private
const getCategories = asycHandler(async (req, res) => {
  const categories = await Categorie.find({ user_id: req.user.id });
  res.status(200).json(categories);
});

//@desc post categorie
//@route post /api/dashboard/categories
//@access private
const createCategories = asycHandler(async (req, res) => {
  const { name, description, status } = req.body;
  const categorieAvailable = await Categorie.find({
    user_id: req.user.id,
  });
  nameCheck(categorieAvailable, name, res);

  if (!name) {
    res.status(400);
    throw Error("Name field is mandatory!");
  }
  const categorie = await Categorie.create({
    name,
    description,
    status,
    user_id: req.user.id,
  });
  res.status(201).json(categorie);
});

//@desc update categorie
//@route update /api/dashboard/categories/:id
//@access private
const updateCategories = asycHandler(async (req, res) => {
  const categorie = await Categorie.findById(req.params.id);
  if (!categorie) {
    res.status(400);
    throw new Error("categorie not Found");
  }

  if (categorie.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error(
      "User don't have permission to update other user categories"
    );
  }

  const updatecategorie = await Categorie.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatecategorie);
});

//@desc delete categories
//@route delete /api/dashboard/categories/:id
//@access private
const deleteCategories = asycHandler(async (req, res) => {
  const categorie = await Categorie.findById(req.params.id);
  if (!categorie) {
    res.status(400);
    throw new Error("categorie not Found");
  }

  if (categorie.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error(
      "User don't have permission to update other user categories"
    );
  }
  await Categorie.deleteOne({ _id: req.params.id });
  res.status(200).json(categorie);
});

module.exports = {
  getCategories,
  createCategories,
  updateCategories,
  deleteCategories,
};
