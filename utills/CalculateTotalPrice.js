const Cart = require("../models/cartModels");
const mongoose = require("mongoose");

const calculatePrice = async (couponData) => {
  try {
    const { coupon, cartTotal } = couponData;
    const { maximum_discount_amount } = coupon;
    let discount = 0;
    if (maximum_discount_amount) {
      discount = Math.min(
        cartTotal * (coupon.maximum_discount_amount / 100),
        maximum_discount_amount
      );
    } else {
      discount = cartTotal * (coupon.maximum_discount_amount / 100);
    }

    const newCartTotal = cartTotal - discount;
    return newCartTotal;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = { calculatePrice };
