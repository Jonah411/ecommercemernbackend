const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

app.use(express.static("./public"));
app.use(express.static("./public/product_image/image"));
app.use(express.static("./public/product_image/gallery"));
//use of multer package
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/product_image/image");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

let maxSize = 2 * 1000 * 1000;
let upload = multer({
  storage: storage,
  limits: {
    fieldSize: maxSize,
  },
});

let productHandler = upload.fields([
  { name: "product_image", maxCount: 1 },
  { name: "product_gallery", maxCount: 5 },
]);

module.exports = { productHandler };
