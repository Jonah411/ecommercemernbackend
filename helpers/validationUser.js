const userValidation = (
  first_name,
  last_name,
  email,
  password,
  confirm_password,
  res
) => {
  if (!first_name) {
    res.status(400);
    throw Error("First name is mandatory");
  } else if (!last_name) {
    res.status(400);
    throw Error("Last name is mandatory");
  } else if (!email) {
    res.status(400);
    throw Error("Email is mandatory");
  } else if (!password) {
    res.status(400);
    throw Error("Password is mandatory");
  } else if (!confirm_password) {
    res.status(400);
    throw Error("Confirm password is mandatory");
  }
};
const nameCheck = (data, nameIndex, res) => {
  data.find((item) => {
    if (item.name === nameIndex) {
      res.status(400);
      throw Error("Name already registered");
    }
  });
};
module.exports = { userValidation, nameCheck };
