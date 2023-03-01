const asycHandler = require("express-async-handler");
const categoriesHandler = require("../helpers/categoriesUpload");
const ParentCategorie = require("../models/parentCategorieModels");
const SubCategorie = require("../models/subCategorieModels");
const Categorie = require("../models/categorieModels");

const parseJson = (data) => {
  let field = "json_data";
  var value;
  if (data[field] && typeof data[field] === "string") {
    value = JSON.parse(data[field]);
  }
  return value;
};
//@desc Get all categories
//@route Get /api/dashboard/categories
//@access private
const createCategorie = asycHandler(async (req, res) => {
  categoriesHandler(req, res, async (err) => {
    const confiq = parseJson(req.body);
    const { filename } = req.file;
    if (confiq.carectories_parent === 1) {
      const parent = await ParentCategorie.findOne({
        name: confiq.carectories_name,
      });
      if (!parent) {
        await ParentCategorie.create({
          name: confiq.carectories_name,
        });
      } else {
        res
          .status(400)
          .json({ status: false, msg: "Categories already registered" });
      }
    } else {
      const subcategories = await SubCategorie.findOne({
        name: confiq.carectories_name,
      });

      if (!subcategories) {
        await SubCategorie.create({
          name: confiq.carectories_name,
          parent_categories: confiq.carectories_parent,
        });
      } else {
        res
          .status(400)
          .json({ status: false, msg: "Categories already registered" });
      }
    }

    const subCateData = await SubCategorie.findOne({
      name: confiq.carectories_name,
    });
    if (confiq.carectories_parent === 1) {
      parentData = await ParentCategorie.findOne({
        name: confiq.carectories_name,
      });
    } else {
      parentData = await ParentCategorie.findOne({
        _id: subCateData?.parent_categories,
      });
    }

    const categories = await Categorie.findOne({
      name: confiq.carectories_name,
    });
    if (!categories) {
      await Categorie.create({
        name: confiq.carectories_name,
        description: confiq.carectories_des,
        categorie_image: filename,
        parent_categories: parentData?._id,
        sub_categories: subCateData?._id,
        status: 1,
      });
      res
        .status(201)
        .json({ status: false, msg: "Categories add successfully" });
    }
  });
  //const categories = await Categorie.find({ user_id: req.user.id });
});

const getParent = asycHandler(async (req, res) => {
  const categories = await ParentCategorie.find({});
  res.status(200).json(categories);
});

const getCategories = asycHandler(async (req, res) => {
  const categories = await Categorie.find({});
  const parent = await ParentCategorie.find({});
  //const categorie = await Categorie.find({ parent_categories: parent._id });
  //let datalistData = [];
  //   parent.map((data) => {
  //     Categorie.find({ parent_categories: data._id }).then((datalist) => {
  //       datalistData.push(datalist);
  //     });
  //   });
  const getDataList = async () => {
    const datalistData = [];
    for (const data of parent) {
      const datalist = await Categorie.find({ parent_categories: data._id });
      datalistData.push(datalist);
    }
    return datalistData;
  };

  getDataList().then((dataList) => {
    res
      .status(200)
      .json({ status: true, data: categories, categories: dataList });
  });
});

const getCategorie = asycHandler(async (req, res) => {
  const id = req.params.id;
  const categorie = await Categorie.findOne({ _id: id });
  const parentCategorie = await ParentCategorie.findOne({
    _id: categorie.parent_categories,
  });
  const subCategorie = await SubCategorie.findOne({
    _id: categorie.sub_categories,
  });
  res.status(200).json({
    status: true,
    data: categorie,
    parentData: parentCategorie,
    subData: subCategorie,
  });
});

module.exports = {
  createCategorie,
  getParent,
  getCategorie,
  getCategories,
};
