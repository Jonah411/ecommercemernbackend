const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

app.use(express.static("./public"));
app.use(express.static("./public/profile-images"));
//use of multer package
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/profile-images");
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

let uploadHandler = upload.single("pro_image");

module.exports = uploadHandler;
