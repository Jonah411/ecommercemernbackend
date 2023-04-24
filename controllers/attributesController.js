const asycHandler = require("express-async-handler");
const Attributes = require("../models/attributesModels");
const SimpleProduct = require("../models/productSimpleModels");

const getAttributes = asycHandler(async (req, res) => {
  const ids = req.params.ids.split(",");
  try {
    const attributes = await Attributes.find({
      _id: { $in: ids },
    });
    res.json(attributes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const createAttributes = asycHandler(async (req, res) => {
  try {
    const attribute = req.body;
    const SimpleProductId = req.params.id;

    const attributesData = await Attributes.create(attribute);

    const updatedProduct = await SimpleProduct.findOneAndUpdate(
      { _id: SimpleProductId },
      { $push: { attributes: attributesData?._id } },
      { new: true }
    );
    return res.status(201).json({
      status: true,
      msg: "Attributes added successfully",
      data: updatedProduct,
    });
    // res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const deleteAttributes = asycHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const attributes = await Attributes.deleteOne({ _id: id });

    if (attributes.deletedCount === 0) {
      return res.status(404).json({ error: "Attribute not found" });
    }
    return res.status(200).json({
      status: true,
      msg: "Attributes Delete successfully",
      data: attributes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = {
  getAttributes,
  createAttributes,
  deleteAttributes,
};
