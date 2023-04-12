const mongoose = require("mongoose");

const ProductTypesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const ProductTypes = mongoose.model("ProductTypes", ProductTypesSchema);
module.exports = ProductTypes;
