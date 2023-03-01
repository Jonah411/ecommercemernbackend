const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the brand name"],
    },
    description: {
      type: String,
      required: [true, "Please add the brand description"],
    },
    brand_image: {
      type: String,
    },
    status: {
      type: Number,
      default: () => 0,
    },
  },
  { timestamps: true }
);

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
