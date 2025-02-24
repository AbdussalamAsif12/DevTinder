const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const User = require("../models/user.model");

authRouter.post("/signup", async (req, res) => {
  try {
    await validateSignUpData(req);
    const { firstName, lastName, emailId, password, age, gender } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

      // Correctly set the cookie
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    res.json({ message: "User Added Successfully", data: savedUser });
  } catch (err) {
    res.status(400).send(`Error saving the user: ${err.message}`);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    await validateLoginData(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      // Correctly set the cookie
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout Successfully!");
  } catch (err) {
    throw new err(`ERROR : ${err.message}`);
  }
});

module.exports = authRouter;
