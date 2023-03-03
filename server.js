const express = require("express");
const connectDB = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const cors = require("cors");
const corsOptions = require("./config/corsOptions");

connectDB();
const app = express();

app.use(cors(corsOptions)); // Use the cors middleware with the options

// Your routes and other middleware go here

app.use(errorHandler); // Your error handler middleware

const port = process.env.PORT || 5000;

app.use("/categories", express.static("public"));
app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/categories", require("./routes/categoriesRoutes"));
app.use("/api/product", require("./routes/productRoutes"));
app.use("/api/brand", require("./routes/brandRoutes"));
app.use("/api/wishlist", require("./routes/wishListRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));
app.use("/api/address", require("./routes/addressRoutes"));

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
