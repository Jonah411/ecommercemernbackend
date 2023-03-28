const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.static("./public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/reviews_image");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "_" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const maxSize = 2 * 1000 * 1000; // 2MB
const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
  },
});

const reviewsHandler = upload.array("review_image");

module.exports = reviewsHandler;
