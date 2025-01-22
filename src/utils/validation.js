const validator = require("validator");
const User = require("../models/user.model");

const validateSignUpData = async (req) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  }

  const existingUser = await User.findOne({ emailId });
  if (existingUser) {
    throw new Error("Email is already taken!");
  }

  if (!password || typeof password !== "string") {
    throw new Error("Password is required and must be a string!");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password!");
  }

  if (age && (isNaN(age) || age <= 18)) {
    throw new Error("You are not 18!");
  }

  if (gender && !["male", "female", "other"].includes(gender.toLowerCase())) {
    throw new Error("Gender must be male, female, or other!");
  }
};

const validateLoginData = async (req) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    throw new Error("Enter Both Fields!");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  }

  if (!password || typeof password !== "string") {
    throw new Error("Password is required and must be a string!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];
  const idEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return idEditAllowed;
};





module.exports = {
  validateSignUpData,
  validateLoginData,
  validateEditProfileData,
};
