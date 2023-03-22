const asycHandler = require("express-async-handler");
const Cart = require("../models/cartModels");
const { calculateTotalPrice } = require("../utills/CalculatePrice");
const { calculatePrice } = require("../utills/CalculateTotalPrice");

const applyCoupon = asycHandler(async (req, res) => {
  const { cartId, couponCode, totalProductPrice } = req.body;
  let cartTotal = null;
  if (cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cartTotal = await calculateTotalPrice(cart?.user.toString());
    await cart.save();
  }

  let coupons = [
    {
      id: 1,
      code: "SAVE10",
      description: "Get 10% off your purchase",
      expiration_date: "2023-12-31",
      minimum_purchase_amount: 50.0,
      maximum_discount_amount: 25.0,
    },
    {
      id: 2,
      code: "FREESHIPPING",
      description: "Free shipping on all orders",
      expiration_date: "2023-09-30",
      minimum_purchase_amount: 0.0,
      maximum_discount_amount: null,
    },
    {
      id: 3,
      code: "SALE20",
      description: "Get 20% off your purchase",
      expiration_date: "2023-06-30",
      minimum_purchase_amount: 100.0,
      maximum_discount_amount: 50.0,
    },
  ];
  const coupon = coupons.find((c) => c.code === couponCode);

  if (!coupon) {
    return res.status(404).json({ message: "Invalid coupon code" });
  }

  const { minimum_purchase_amount } = coupon;

  if (totalProductPrice) {
    cartTotal = totalProductPrice;
  }

  if (cartTotal < minimum_purchase_amount) {
    return res.status(400).json({
      message: `Minimum purchase amount is ${minimum_purchase_amount}`,
    });
  }
  let data = {
    coupon: coupon,
    cartTotal: cartTotal,
  };
  const totalPrice = await calculatePrice(data);

  res.json({
    status: true,
    message: "Coupon applied successfully",
    totalPrice,
    subtotalPrice: cartTotal,
  });
});

module.exports = {
  applyCoupon,
};
