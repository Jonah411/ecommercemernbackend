const GroupedProduct = require("../models/productGroupedModels");
const SimpleProduct = require("../models/productSimpleModels");

const addSimpleProduct = async (productData) => {
  const {
    strength,
    pack_size,
    sku,
    stock_status,
    stock_quantity,
    backorders_status,
    stock_threshold,
    manage_stock,
    sold_individually,
    related_products,
    like_products,
  } = productData;
  const simpleProduct = await SimpleProduct.create({
    strength,
    pack_size,
    sku,
    stock_status,
    manage_stock,
    sold_individually,
    stock_quantity,
    backorders_status,
    stock_threshold,
    related_products,
    like_products,
  });
  return simpleProduct;
};

const updateSimpleProduct = async (productData, product_detail, req, res) => {
  const {
    strength,
    pack_size,
    sku,
    stock_status,
    stock_quantity,
    backorders_status,
    stock_threshold,
    manage_stock,
    sold_individually,
    related_products,
    like_products,
  } = productData;
  if (product_detail.simple_product) {
    try {
      const updatedProduct = await SimpleProduct.findOneAndUpdate(
        { _id: product_detail.simple_product },
        {
          strength,
          pack_size,
          sku,
          manage_stock,
          sold_individually,
          stock_status,
          stock_quantity,
          backorders_status,
          stock_threshold,
          related_products,
          like_products,
        },
        { new: true }
      );
      console.log(updatedProduct);
      if (!updatedProduct) {
        return res.status(404).json({ error: "SimpleProduct not found" });
      }

      return updatedProduct;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update SimpleProduct" });
    }
  } else {
    const simpleProduct = addSimpleProduct(productData);
    return simpleProduct;
  }
};

const addGroupedProduct = async (productData) => {
  const { sku, group_products, related_products, like_products } = productData;
  const groupProduct = await GroupedProduct.create({
    sku,
    group_products,
    related_products,
    like_products,
  });
  return groupProduct;
};

const updateGroupedProduct = async (productData, product_detail, req, res) => {
  const { sku, group_products, related_products, like_products } = productData;
  if (product_detail.group_product) {
    try {
      const groupedProduct = await GroupedProduct.findByIdAndUpdate(
        { _id: product_detail.group_product },
        { sku, group_products, related_products, like_products },
        { new: true }
      );

      if (!groupedProduct) {
        return res.status(404).json({ message: "Grouped Product not found" });
      }
      console.log(groupedProduct);

      return groupedProduct;
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Failed to update Grouped Product" });
    }
  } else {
    const groupedProduct = addGroupedProduct(productData);
    return groupedProduct;
  }
};

module.exports = {
  addSimpleProduct,
  addGroupedProduct,
  updateSimpleProduct,
  updateGroupedProduct,
};
