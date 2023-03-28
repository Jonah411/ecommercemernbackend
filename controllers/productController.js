const asycHandler = require("express-async-handler");
const { productHandler } = require("../helpers/productUpload");
const Product = require("../models/productModels");

//@desc Get all products
//@route Get /api/product/
//@access public
const getProducts = asycHandler(async (req, res) => {
  const id = req.params.id;
  const type = req.params.type;
  if (type === "category") {
    Product.find({ categories: id })
      .populate({
        path: "categories",
        select: "name description categorie_image",
        populate: [
          {
            path: "parent_categories",
            select: "name description categorie_image",
          },
          {
            path: "sub_categories",
            select: "name description categorie_image",
          },
        ],
      })
      .populate({
        path: "brands",
        select: "name brand_image",
      })
      .populate({
        path: "wishlist",
        select: "user_id product_id",
      })
      .populate({
        path: "rating_star.rating",
      })
      .exec(function (err, products) {
        if (err) {
          try {
            throw err;
          } catch (error) {}
        }
        return res.status(200).json({ status: true, data: products });
      });
  }
  if (type === "brand") {
    Product.find({ brands: id })
      .populate({
        path: "categories",
        select: "name description categorie_image",
        populate: [
          {
            path: "parent_categories",
            select: "name description categorie_image",
          },
          {
            path: "sub_categories",
            select: "name description categorie_image",
          },
        ],
      })
      .populate({
        path: "brands",
        select: "name brand_image",
      })
      .populate({
        path: "wishlist",
        select: "user_id product_id",
      })
      .populate({
        path: "rating_star.rating",
      })
      .exec(function (err, products) {
        if (err) {
          try {
            throw err;
          } catch (error) {}
        }
        return res.status(200).json({ status: true, data: products });
      });
  }
  if (type === "product") {
    Product.find({ _id: id })
      .populate({
        path: "categories",
        select: "name description categorie_image",
        populate: [
          {
            path: "parent_categories",
            select: "name description categorie_image",
          },
          {
            path: "sub_categories",
            select: "name description categorie_image",
          },
        ],
      })
      .populate({
        path: "brands",
        select: "name brand_image",
      })
      .populate({
        path: "wishlist",
        select: "user_id product_id",
      })
      .populate({
        path: "rating_star.rating",
      })
      .exec(function (err, product) {
        if (err) {
          return res
            .status(500)
            .json({ status: false, message: "Error finding product" });
        }
        if (!product) {
          return res
            .status(404)
            .json({ status: false, message: "Product not found" });
        }
        return res.status(200).json({ status: true, data: product });
      });
  }
});

const getAllProducts = asycHandler(async (req, res) => {
  //const products = await Product.find({});
  Product.find({})
    .populate("categories brands wishlist")
    .exec(function (err, products) {
      if (err) {
        try {
          throw err;
        } catch (error) {}
      }
      res.status(200).json({ status: true, data: products });
    });
});

const parseJson = (data) => {
  let field = "json_data";
  var value;
  if (data[field] && typeof data[field] === "string") {
    value = JSON.parse(data[field]);
  }
  return value;
};

const createProduct = asycHandler(async (req, res) => {
  productHandler(req, res, async (err) => {
    const { product_image, product_gallery } = req.files;
    const singleImage = [];
    const multipleImage = [];
    product_image.map((data) => {
      return singleImage.push(data?.filename);
    });
    product_gallery.map((data) => {
      return multipleImage.push(data?.filename);
    });
    const confiq = parseJson(req.body);
    const product = await Product.findOne({
      name: confiq.name,
    });
    if (!product) {
      await Product.create({
        name: confiq.name,
        description: confiq.description,
        product_image: singleImage[0],
        product_gallery: multipleImage,
        price: confiq.price,
        product_strength: confiq.product_strength,
        pack_size: confiq.pack_size,
        rating_star: confiq.rating_star,
        categories: confiq.categories,
        brands: confiq.brand,
      });
      res.status(201).json({ status: false, msg: "Product add successfully" });
    } else {
      res
        .status(400)
        .json({ status: false, msg: "Product already registered" });
    }
  });
});

module.exports = {
  getProducts,
  createProduct,
  getAllProducts,
};
