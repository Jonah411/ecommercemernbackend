const mongoose = require("mongoose");

const categorieSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the categorie name"],
    },
    description: {
      type: String,
      required: [true, "Please add the categorie description"],
    },
    categorie_image: {
      type: String,
    },
    parent_categories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParentCategorie",
    },
    sub_categories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParentCategorie",
    },
    status: {
      type: Number,
      default: () => 0,
    },
  },
  { timestamps: true }
);

const Categorie = mongoose.model("Categorie", categorieSchema);
module.exports = Categorie;
