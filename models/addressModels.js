const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  address: [
    {
      name: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zip: {
        type: Number,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      mainaddress: {
        type: Number,
        default: () => 0,
      },
    },
  ],
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
