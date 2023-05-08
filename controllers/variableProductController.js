const asyncHandler = require("express-async-handler");
const { productHandler } = require("../helpers/productUpload");
const VariableProduct = require("../models/productVariableModels");
const VariantsProduct = require("../models/productVariantsModels");
const {
  ProductDetails,
  ProductDetailsSchema,
  setProductPrice,
} = require("../models/productDetailsModels");
ProductDetailsSchema.pre("save", setProductPrice);
const parseJson = (data) => {
  let field = "json_data";
  var value;
  if (data[field] && typeof data[field] === "string") {
    value = JSON.parse(data[field]);
  }
  return value;
};

const createVariableProductsVariants = asyncHandler(async (req, res) => {
  const ProductId = [];
  productHandler(req, res, async (err) => {
    try {
      const confiq = parseJson(req.body);
      const { product_image, product_gallery } = req.files;
      const singleImage = [];
      const multipleImage = [];
      product_image.map((data) => {
        return singleImage.push(data?.filename);
      });
      product_gallery.map((data) => {
        return multipleImage.push(data?.filename);
      });
      const variableproduct = await VariableProduct.create({
        name: confiq.name,
        email: confiq.email,
        description: confiq.description,
        regular_price: confiq.regular_price,
        sale_price: confiq.sale_price,
        sale_price_start: confiq.sale_price_start,
        sale_price_end: confiq.sale_price_end,
        product_image: singleImage[0],
        product_gallery: multipleImage,
        sku: confiq.sku,
        stock_quantity: confiq.stock_quantity,
        // manage_stock: confiq.manage_stock,
        sold_individually: confiq.sold_individually,
        quantity_status: confiq.quantity_status,
        min_stock_quantity: confiq.min_stock_quantity,
        backorders_status: confiq.backorders_status,
        stock_threshold: confiq.stock_threshold,
        stock_status: confiq.stock_status,
        strength: confiq.strength,
        pack_size: confiq.pack_size,
        defaultvariant: confiq.default_value_variant,
      });
      ProductId.push(variableproduct._id);

      return res.status(200).json({
        data: ProductId,
        msg: "Variants Add Successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error adding product" });
    }
  });
});

const getVariableProduct = asyncHandler(async (req, res) => {
  const ids = req.params.ids;
  try {
    const variants = await VariantsProduct.findById({
      _id: ids,
    }).populate("attributes variantId");
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getVariantsProduct = asyncHandler(async (req, res) => {
  const ids = req.params.ids.split(",");

  try {
    const variants = await VariableProduct.find({
      _id: { $in: ids },
    });
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const updateVariantsProductDetails = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const {
    description,
    regular_price,
    sale_price,
    sale_price_start,
    sale_price_end,
    product_gallery,
    VariableProduct_id,
    strength,
    pack_size,
    min_stock_quantity,
    manage_stock,
    quantity_status,
    sku,
    stock_quantity,
    stock_status,
    stock_threshold,
  } = req.body;
  try {
    const ProductDetailsVariantsUpdate = await VariantsProduct.findOneAndUpdate(
      { _id: VariableProduct_id },
      {
        strength,
        pack_size,
        min_stock_quantity,
        manage_stock,
        quantity_status,
        sku,
        stock_quantity,
        stock_status,
        stock_threshold,
      },
      { new: true }
    );
    if (!ProductDetailsVariantsUpdate) {
      return res
        .status(404)
        .json({ error: "ProductDetails variants not found" });
    }
    const ProductDetailsUpdate = await ProductDetails.findOneAndUpdate(
      { _id: id },
      {
        description,
        regular_price,
        sale_price,
        sale_price_start,
        sale_price_end,
        product_gallery,
        update_date: new Date(),
      },
      { new: true }
    );
    await ProductDetailsUpdate.save();
    if (!ProductDetailsUpdate) {
      return res.status(404).json({ error: "ProductDetails not found" });
    }
    await ProductDetails.findOne({ _id: ProductDetailsUpdate._id })
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
        return res.status(200).json({
          status: true,
          data: product,
          msg: "Product Update Successfully!",
        });
      });
    // return res.status(200).json({
    //   data: ProductDetailsUpdate,
    //   variantData: ProductDetailsVariantsUpdate,
    // });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update ProductDetails" });
  }
});

module.exports = {
  createVariableProductsVariants,
  getVariableProduct,
  getVariantsProduct,
  updateVariantsProductDetails,
};
