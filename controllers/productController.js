const asycHandler = require("express-async-handler");
const { productHandler } = require("../helpers/productUpload");
const Product = require("../models/productModels");
const { createReview } = require("./recentViewProductController");
const User = require("../models/userModels");
const { createRelated } = require("./relatedProductController");
const RelatedProduct = require("../models/relatedProductsModels");
const {
  setProductPrice,
  ProductDetailsSchema,
  ProductDetails,
} = require("../models/productDetailsModels");
const { getGroupedProductDetails } = require("./productDetailsController");

ProductDetailsSchema.pre("save", setProductPrice);
const getProducts = asycHandler(async (req, res) => {
  const id = req.params.id;
  const type = req.params.type;
  const userData = req.params.user;
  const userList = await User.findById(userData);
  if (userList) {
    await createReview(id, userList?._id);
    if (type === "category") {
      ProductDetails.find({ categories: id })
        .populate({
          path: "categorie",
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
          path: "brand",
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
      ProductDetails.find({ brands: id })
        .populate({
          path: "categorie",
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
          path: "brand",
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
      ProductDetails.findOne({ _id: id })
        .populate({
          path: "categorie",
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
          path: "brand",
          select: "name brand_image",
        })
        .populate({
          path: "wishlist",
          select: "user_id product_id",
        })
        .populate({
          path: "rating_star.rating",
        })
        .populate({
          path: "simple_product",
        })
        .populate({
          path: "group_product",
        })
        .populate({
          path: "variable_product",
        })

        .exec(async (err, product) => {
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
          if (product.group_product) {
            const GroupProductDetails = await getGroupedProductDetails(
              product.group_product._id
            );
            return res.status(200).json({
              status: true,
              data: product,
              GroupProductDetails: GroupProductDetails,
            });
          } else {
            return res.status(200).json({
              status: true,
              data: product,
            });
          }

          // const relatedProducts = await RelatedProduct.find({
          //   _id: { $in: product.related_products },
          // });
        });
    }
  } else {
    res.status(400).json("User is not defined");
  }
});

const getAllProducts = asycHandler(async (req, res) => {
  //const products = await Product.find({});
  // Product.find({})
  //   .populate("categories brands wishlist")
  //   .exec(function (err, products) {
  //     if (err) {
  //       try {
  //         throw err;
  //       } catch (error) {}
  //     }
  //     res.status(200).json({ status: true, data: products });
  //   });
  try {
    const productDetails = await ProductDetails.find({}).populate(
      "categorie brand wishlist simple_product group_product variable_product"
    );
    for (let i = 0; i < productDetails.length; i++) {
      await productDetails[i].save();
    }
    res.status(200).json({ success: true, data: productDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
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
      try {
        const newProduct = await Product.create({
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
        if (confiq.related_products) {
          const relatedProduct = await createRelated(
            newProduct._id,
            confiq.related_products
          );
          const result = await Product.findOneAndUpdate(
            { _id: newProduct._id },
            { related_products: relatedProduct },
            { upsert: true, new: true }
          );
          // newProduct.related_products = relatedProduct;
        }
        return res
          .status(201)
          .json({ status: false, msg: "Product add successfully" });
      } catch (error) {
        console.error(error);
      }
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
