const asycHandler = require("express-async-handler");
const { userValidation } = require("../helpers/validationUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const Roll = require("../models/rollModels");
const uploadHandler = require("../helpers/fileUpload");

//@desc Get all users
//@route Get /api/users
//@access public
const getUsers = asycHandler(async (req, res) => {
  User.find({})
    .populate("roll_id")
    .exec(function (err, users) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "An error occurred while fetching users",
          data: null,
        });
      }
      return res.status(200).json({
        status: true,
        message: "Get all users successfully",
        data: users,
      });
    });
});

//@desc Get single user
//@route Get /api/users/:id
//@access public
const getUser = asycHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw Error("User Not Found");
  }
  res.status(200).json(user);
});

const parseJson = (data) => {
  let field = "json_data";
  var value;
  if (data[field] && typeof data[field] === "string") {
    value = JSON.parse(data[field]);
  }
  return value;
};
//@desc Create user
//@route POST /api/users/
//@access public
const createUser = asycHandler(async (req, res) => {
  uploadHandler(req, res, async (err) => {
    const confiq = parseJson(req.body);
    const { first_name, last_name, email, password, confirm } = confiq;
    userValidation(first_name, last_name, email, password, confirm, res);
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw Error("Email already registered");
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedConfirmPassword = await bcrypt.hash(confirm, 10);
    const { filename } = req.file;
    //const userid = await User.findOne({ email: "jonahjohn411@gmail.com" });
    Roll.findOne({ name: "user" }, (error, roll) => {
      if (error) {
        console.log(error);
      } else {
        const newUser = new User({
          roll_id: roll._id,
          first_name,
          last_name,
          email,
          password: hashedPassword,
          confirm_password: hashedConfirmPassword,
          pro_image: filename,
        });

        newUser.save((error) => {
          if (error) {
            console.log(error);
          }
        });
        User.find({}, (error, users) => {
          if (error) {
            console.log(error);
          } else {
            res.status(201).json({ _id: users.id, email: users.email });
          }
        });
      }
    });

    // const user = await User.create({
    //   first_name,
    //   last_name,
    //   email,
    //   password: hashedPassword,
    //   confirm_password: hashedConfirmPassword,
    //   pro_image: filename,
    // });
    // if (user) {
    //   res.status(201).json({ _id: user.id, email: user.email });
    // } else {
    //   res.status(400);
    //   throw Error("User data us not valid");
    // }
  });
});

//@desc Update user
//@route PUT /api/users/:id
//@access public
const updateUser = asycHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw Error("User Not Found");
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedUser);
});

//@desc Delete user
//@route DELETE /api/users/:id
//@access public
const deleteUser = asycHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await User.findOneAndDelete({ _id: userId });
    if (!userData) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(201).json({
      status: true,
      message: "User delete successfully!",
    });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
});

//@desc Delete user
//@route DELETE /api/users/:id
//@access public
const loginUser = asycHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw Error("All field is mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          id: user.id,
          pro_image: user.pro_image,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw Error("Email or Password is not valid");
  }
});

//@desc Auth user
//@route Get /api/users/
//@access private
const currentUser = asycHandler(async (req, res) => {
  const refreshToken = req.params.id;
  // Verify the refresh token
  jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Create a new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Send the new access token as a response
    res.json({ accessToken: accessToken });
  });
});

const refreshUser = asycHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken;

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Create a new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Send the new access token as a response
    res.json({ accessToken: accessToken });
  });
});

const updateRollUser = asycHandler(async (req, res) => {
  const { userId, newRollId } = req.body;

  const rollId = await Roll.findOne({ name: newRollId });
  User.updateOne(
    { _id: userId },
    { roll_id: rollId?._id },
    function (err, result) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "An error occurred while updating the user",
          data: null,
        });
      }
      return res.status(200).json({
        status: true,
        message: "User roll updated successfully",
        data: result,
      });
    }
  );
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  currentUser,
  refreshUser,
  updateRollUser,
};
