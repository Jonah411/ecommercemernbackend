const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    roll_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roll",
      required: true,
      enum: ["admin", "developer", "user"],
    },
    first_name: {
      type: String,
      required: [true, "Please add the user first name"],
    },
    last_name: {
      type: String,
      required: [true, "Please add the user Last name"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email"],
      unique: [true, "Email address already taken"],
    },
    pro_image: {
      type: String,
      required: [true, "Please add the user image"],
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
    confirm_password: {
      type: String,
      required: [true, "Please add the user confirm password"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
