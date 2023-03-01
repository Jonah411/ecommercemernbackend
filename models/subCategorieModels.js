const mongoose = require("mongoose");

const subCategorieSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add the categorie name"],
  },
  parent_categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParentCategorie",
  },
});

const SubCategorie = mongoose.model("SubCategorie", subCategorieSchema);
module.exports = SubCategorie;
