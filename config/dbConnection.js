const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.DATABASE);
    console.log(
      "Database connect: ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
