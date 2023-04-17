const ProductDetails = require("../models/productDetailsModels");
const SimpleProduct = require("../models/productSimpleModels");
const User = require("../models/userModels");
const nodemailer = require("nodemailer");

const stockQuantity = async (order) => {
  order.items.forEach((element) => {
    ProductDetails.findOne({ _id: element.product })
      .populate("simple_product")
      .exec(async (err, productDetail) => {
        if (err) {
        } else {
          if (productDetail.simple_product.stock_quantity) {
            const changeQuantityStock =
              productDetail.simple_product.stock_quantity - element.quantity;
            if (
              changeQuantityStock <=
              productDetail.simple_product.stock_threshold
            ) {
              await stockMail(order);
            }
            if (changeQuantityStock > 0) {
              productDetail.simple_product.stock_quantity = changeQuantityStock;
              await SimpleProduct.findOneAndUpdate(
                { _id: productDetail.simple_product._id },
                { $set: { stock_quantity: changeQuantityStock } },
                { new: true }
              )
                .then((updatedProduct) => {
                  // Handle the updated product data, e.g. update state or send a response
                  console.log(updatedProduct);
                })
                .catch((err) => {
                  // Handle error, e.g. log or return an error response
                  console.error(err);
                });
            } else {
              await SimpleProduct.findOneAndUpdate(
                { _id: productDetail.simple_product._id },
                { $set: { stock_status: "Out of stock", stock_quantity: 0 } },
                { new: true }
              )
                .then((updatedProduct) => {
                  // Handle the updated product data, e.g. update state or send a response
                  console.log(updatedProduct);
                })
                .catch((err) => {
                  // Handle error, e.g. log or return an error response
                  console.error(err);
                });
            }
          }
        }
      });
  });
};
const stockMail = async (order) => {
  const { user } = order;
  const useDetails = await User.findOne(user);
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "enola32@ethereal.email",
      pass: "WVUGgYTuuNbQxYTyka",
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"jonah test 👻" <jonahjohn411@gmail.com>', // sender address
    to: "jonahjohn1796@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
module.exports = { stockQuantity, stockMail };
