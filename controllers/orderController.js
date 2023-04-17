const asycHandler = require("express-async-handler");
const Cart = require("../models/cartModels");
const Order = require("../models/orderModels");
const { stockQuantity } = require("../utills/StockQuantityManage");
const stripe = require("stripe")(process.env.StripeAPIKey);

const getOrder = asycHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const orderType = req.params.type;
    Order.find({ user: userId, status: orderType })
      .populate("items.product", "name price product_image")
      .exec()
      .then(async (order) => {
        return res.status(201).json({
          status: true,
          message: "Order added successfully",
          order: order,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: "order retrieval failed",
          error: error,
        });
      });
    // const order = await Order.find({ user: userId, status: orderType });
    // return res.status(201).json({
    //   status: true,
    //   message: "Order added successfully",
    //   order: order,
    // });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const createOrder = asycHandler(async (req, res) => {
  try {
    const { user, items, totalPrice, billingaddress, subtotalPrice } = req.body;
    const order = await Order.create({
      user,
      items,
      totalPrice,
      billingaddress,
      subtotalPrice,
    });
    if (order) {
      await stockQuantity(order);
      await Cart.deleteOne({ user: user });
    }
    return res.status(201).json({
      status: true,
      msg: "Order added successfully",
      order: order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
const addOrder = asycHandler(async (req, res) => {
  try {
    const { user, items, billingaddress, subtotalPrice, totalPrice, token } =
      req.body;
    console.log(token.id);
    stripe.customers
      .create({
        email: token.email,
        source: "tok_visa",
      })
      .then((customer) => {
        stripe.paymentIntents
          .create({
            amount: totalPrice,
            currency: "inr",
            customer: customer.id,
            description: "sub",
            receipt_email: token.email,
          })
          .then((paymentIntent) => {
            stripe.paymentIntents
              .confirm(paymentIntent.id, {
                payment_method: "pm_card_visa",
              })
              .then((result) => {
                console.log(result);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    // const product = await stripe.products.create({
    //   name: "Product Name",
    // });

    // const price = await stripe.prices.create({
    //   unit_amount: totalPrice * 100,
    //   currency: "inr",
    //   product: product.id,
    // });

    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   line_items: [
    //     {
    //       price: price.id,
    //       quantity: 1,
    //     },
    //   ],
    //   mode: "payment",
    //   success_url: "https://example.com/success",
    //   cancel_url: "https://example.com/cancel",
    // });
    // if (!session) throw Error("Payment failed");
    // console.log(session);
    //if (session) {
    // Create a new order with the order data
    // const order = new Order({
    //   user,
    //   items,
    //   billingaddress,
    //   subtotalPrice,
    //   totalPrice,
    // });

    // // Save the new order to the database
    // await order.save();

    // Send a response indicating that the order was created successfully
    //  res.status(201).json({ success: true, data: "order" });
    //  }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = { getOrder, createOrder, addOrder };
