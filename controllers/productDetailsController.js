const asyncHandler = require("express-async-handler");
const ProductDetails = require("../models/productDetailsModels");
const ProductTypes = require("../models/productTypesModels");
const { productHandler } = require("../helpers/productUpload");
const {
  addSimpleProduct,
  addGroupedProduct,
  updateSimpleProduct,
  updateGroupedProduct,
} = require("../utills/ProductAdd");
const GroupedProduct = require("../models/productGroupedModels");

const getProductTypes = asyncHandler(async (req, res) => {
  try {
    const productTypes = await ProductTypes.find({});
    return res.status(200).json({
      status: true,
      data: productTypes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting product types" });
  }
});

const createProductTypes = async (req, res) => {
  try {
    // Create an array of product types
    const productTypes = [
      { name: "Simple Product" },
      { name: "Grouped Product" },
      { name: "Variable Product" },
      { name: "External / Affiliate Product" },
    ];

    // Loop through the array and save each product type to the database
    for (const productType of productTypes) {
      const productTypeName = await ProductTypes.findOne({
        name: productType.name,
      });
      if (!productTypeName) {
        const newProductType = new ProductTypes(productType);
        await newProductType.save();
      }
    }

    // Send a response indicating success
    res.status(200).json({
      status: true,
      message: "Product types created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating product types" });
  }
};
const parseJson = (data) => {
  let field = "json_data";
  var value;
  if (data[field] && typeof data[field] === "string") {
    value = JSON.parse(data[field]);
  }
  return value;
};

const createProduct = asyncHandler(async (req, res) => {
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
    try {
      let product;
      const product_detail = await ProductDetails.findOne({
        name: confiq.name,
      });
      const productType = await ProductTypes.findOne({
        _id: confiq.product_types,
      });
      if (!product_detail) {
        const {
          name,
          description,
          short_description,
          categorie,
          brand,
          price,
          sale_price,
          sale_price_start,
          sale_price_end,
        } = confiq;

        switch (productType.name) {
          case "Simple Product":
            product = await addSimpleProduct(confiq);
            if (product) {
              const ProductDetailsAdd = await ProductDetails.create({
                name,
                description,
                short_description,
                categorie,
                brand,
                price,
                sale_price,
                sale_price_start,
                sale_price_end,
                productType: productType._id,
                simple_product: product._id,
                product_image: singleImage[0],
                product_gallery: multipleImage,
              });
              return res.status(200).json({
                data: ProductDetailsAdd,
                msg: "Product Added Successfully!",
              });
            }
            break;
          case "Grouped Product":
            product = await addGroupedProduct(confiq);
            if (product) {
              const ProductDetailsAdd = await ProductDetails.create({
                name,
                description,
                short_description,
                categorie,
                brand,
                price,
                productType: productType._id,
                group_product: product._id,
                product_image: singleImage[0],
                product_gallery: multipleImage,
              });
              return res.status(200).json({
                data: ProductDetailsAdd,
                msg: "Product Added Successfully!",
              });
            }
            break;
          case "Variable Product":
            product = await addVariableProduct(req.body);
            break;
          case "External / Affiliate Product":
            product = await addExternalProduct(req.body);
            break;
          default:
            res.status(400).json({ msg: "Invalid product type" });
            return;
        }
      } else {
        return res.status(400).json({ msg: "Product Already Added!" });
      }

      res.status(201).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error adding product" });
    }
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  productHandler(req, res, async (err) => {
    const { product_image, product_gallery } = req.files;
    const singleImage = [];
    const multipleImage = [];
    if (product_image) {
      product_image.map((data) => {
        return singleImage.push(data?.filename);
      });
    }
    if (product_gallery) {
      product_gallery.map((data) => {
        return multipleImage.push(data?.filename);
      });
    }

    const confiq = parseJson(req.body);
    try {
      let product;
      const product_detail = await ProductDetails.findOne({
        _id: confiq.productId,
      });
      const productType = await ProductTypes.findOne({
        _id: confiq.product_types,
      });
      const {
        productId,
        name,
        description,
        short_description,
        categorie,
        brand,
        price,
        sale_price,
        sale_price_start,
        sale_price_end,
      } = confiq;
      switch (productType.name) {
        case "Simple Product":
          product = await updateSimpleProduct(confiq, product_detail, req, res);
          if (product) {
            const ProductDetailsUpdate = await ProductDetails.findOneAndUpdate(
              { _id: productId },
              {
                name,
                description,
                short_description,
                categorie,
                brand,
                price,
                sale_price,
                sale_price_start,
                sale_price_end,
                product_image: singleImage[0],
                product_gallery: multipleImage,
                productType: productType._id,
                group_product: null,
                simple_product: product._id,
                update_date: new Date(),
              },
              { new: true }
            );
            return res.status(200).json({
              data: ProductDetailsUpdate,
              msg: "Product Update Successfully!",
            });
          }
          break;
        case "Grouped Product":
          product = await updateGroupedProduct(
            confiq,
            product_detail,
            req,
            res
          );
          console.log(product);
          if (product) {
            const ProductDetailsUpdate = await ProductDetails.findOneAndUpdate(
              { _id: productId },
              {
                name,
                description,
                short_description,
                categorie,
                brand,
                price,
                sale_price,
                sale_price_start,
                sale_price_end,
                product_image: singleImage[0],
                product_gallery: multipleImage,
                productType: productType._id,
                group_product: product._id,
                simple_product: null,
                update_date: new Date(),
              },
              { new: true }
            );

            return res.status(200).json({
              data: ProductDetailsUpdate,
              msg: "Product Update Successfully!",
            });
          }
          break;
        case "Variable Product":
          product = await addVariableProduct(req.body);
          break;
        case "External / Affiliate Product":
          product = await addExternalProduct(req.body);
          break;
        default:
          res.status(400).json({ msg: "Invalid product type" });
          return;
      }

      res.status(201).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error adding product" });
    }
  });
});

const getAllProductDetails = asyncHandler(async (req, res) => {
  try {
    const productDetails = await ProductDetails.find({}).populate(
      "categorie brand wishlist simple_product group_product"
    );

    return res.status(200).json({ success: true, data: productDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

const getGroupedProductDetails = async (productId) => {
  try {
    const groupedProduct = await GroupedProduct.findById(productId)
      .populate("group_products")
      .exec();
    if (!groupedProduct) {
      throw new Error("Grouped product not found");
    }
    const products = groupedProduct.group_products;
    return products;
  } catch (error) {
    console.error(error);
    throw new Error("Error finding grouped product");
  }
};
const dropProductDetails = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  console.log("deleteee", productId);
  try {
    const deleteProduct = await ProductDetails.deleteOne({ _id: productId });
    return res.status(200).json({
      success: true,
      data: deleteProduct,
      msg: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
});
module.exports = {
  getProductTypes,
  createProductTypes,
  createProduct,
  getAllProductDetails,
  getGroupedProductDetails,
  updateProduct,
  dropProductDetails,
};
