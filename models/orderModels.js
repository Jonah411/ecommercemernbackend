const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please add user"],
    },
    billingaddress: [
      {
        first_name: {
          type: String,
          required: [true, "First Name is required"],
        },
        last_name: {
          type: String,
          required: [true, "Last Name is required"],
        },
        company_name: {
          type: String,
        },
        street_name: {
          type: String,
          required: [true, "Street Name is required"],
        },
        apartment_name: {
          type: String,
        },
        town_city: {
          type: String,
          required: [true, "Town / City Name is required"],
        },
        post_code: {
          type: String,
          required: [true, "Postcode is required"],
        },
        email: {
          type: String,
          required: [true, "Email is required"],
        },
        phone_number: {
          type: String,
          required: [true, "Phone number is required"],
        },
        additional_inform: {
          type: String,
        },
      },
    ],
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Please add product"],
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotalPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
