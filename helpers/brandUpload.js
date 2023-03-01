const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

app.use(express.static("./public"));
app.use(express.static("./public/brand_image"));
//use of multer package
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/brand_image");
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

let brandHandler = upload.fields([
  { name: "brand_image", maxCount: 1 },
  { name: "brand_banner", maxCount: 1 },
]);
module.exports = brandHandler;
