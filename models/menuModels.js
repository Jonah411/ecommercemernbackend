const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: () => 0,
  },
  status: {
    type: Number,
    default: () => 0,
    required: true,
  },
  roll_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Roll",
    required: true,
  },
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
