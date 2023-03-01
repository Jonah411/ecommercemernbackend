const mongoose = require("mongoose");

const parentCategorieSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add the categorie name"],
  },
});

const ParentCategorie = mongoose.model(
  "ParentCategorie",
  parentCategorieSchema
);

module.exports = ParentCategorie;
