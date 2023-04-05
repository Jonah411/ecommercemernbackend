const asycHandler = require("express-async-handler");
const CompareProduct = require("../models/compareModels");
const Product = require("../models/productModels");
const User = require("../models/userModels");

const getAllCompareList = asycHandler(async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const compareProduct = await CompareProduct.findOne({ userId }).populate({
      path: "products.productId",
    });
    if (!compareProduct) {
      return res.status(404).send("Compare product list not found");
    }
    return res.status(200).json({ data: compareProduct });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

const createCompareList = asycHandler(async (req, res) => {
  const userId = req.params.userId;
  const productId = req.body.productId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const product = await Product.findById(productId).populate(
      "categories brands"
    );
    if (!product) {
      res.status(404).json({ msg: "Product not found" });
    }

    const compareProduct = await CompareProduct.findOne({ userId });
    if (compareProduct) {
      // user already has a compare product list
      const productIndex = compareProduct.products.findIndex(
        (p) => p.productId.toString() === productId
      );
      if (productIndex !== -1) {
        // product already in the compare list
        return res.status(400).json({ msg: "Product already in compare list" });
      }
      if (compareProduct.products.length >= 4) {
        // compare list has reached its maximum length
        return res.status(400).json({ msg: "Compare list is full" });
      }
      // add the product to the existing compare list

      compareProduct.products.push({
        productId,
        name: product.name,
        price: product.price,
        rating: product.rating_star.rating_radio,
        product_strength: product.product_strength,
        pack_size: product.pack_size,
        categorie: product.categories.name,
        brand: product.brands.name,
        image_name: product.product_image,
      });
      await compareProduct.save();
      return res
        .status(200)
        .json({ data: compareProduct, msg: "Compare add Successfully!" });
    } else {
      // create a new compare product list for the user
      const newCompareProduct = new CompareProduct({
        userId,
        products: [
          {
            productId,
            name: product.name,
            price: product.price,
            rating: product.rating_star.rating_radio,
            product_strength: product.product_strength,
            pack_size: product.pack_size,
            categorie: product.categories.name,
            brand: product.brands.name,
            image_name: product.product_image,
          },
        ],
      });
      await newCompareProduct.save();
      return res
        .status(200)
        .json({ data: newCompareProduct, msg: "Compare add Successfully!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

const removeCompareList = asycHandler(async (req, res) => {
  const userId = req.params.userId;
  const productId = req.body.productId;

  CompareProduct.updateOne(
    { userId },
    { $pull: { products: { productId } } },
    (error, result) => {
      if (error) {
        return res.status(400).json({ msg: error });
      } else {
        return res
          .status(200)
          .json({ data: result, msg: "Compare remove product Successfully!" });
      }
    }
  );
});

module.exports = { getAllCompareList, createCompareList, removeCompareList };
