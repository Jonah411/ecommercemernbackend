const mongoose = require("mongoose");

const attributesSchema = new mongoose.Schema({
  attr_name: {
    type: String,
    required: true,
  },
  attr_values: {
    type: [String],
    required: true,
  },
  visible: {
    type: Boolean,
  },
});

const Attributes = mongoose.model("Attributes", attributesSchema);

module.exports = Attributes;
