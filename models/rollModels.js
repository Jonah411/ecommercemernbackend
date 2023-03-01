const mongoose = require("mongoose");

const rollSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Roll = mongoose.model("Roll", rollSchema);

module.exports = Roll;
