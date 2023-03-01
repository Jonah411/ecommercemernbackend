const mongoose = require("mongoose");

const brandBannerSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add the Banner Image File name"],
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  status: {
    type: Number,
    default: () => 0,
  },
});

const BrandBanner = mongoose.model("BrandBanner", brandBannerSchema);
module.exports = BrandBanner;
