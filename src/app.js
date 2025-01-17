const express = require("express");
const connectDB = require("./config/database");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../src/models/models");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

const { validateSignUpData } = require("./utils/validation");

// middlewares

const { userAuth } = require("./middleware/auth");
app.use(express.json());
app.use(cookieParser());

// Post api
app.post("/signup", async (req, res) => {
  // console.log("Request Body:", req.body); // Check incoming data

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
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send(`Error saving the user: ${err.message}`);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "DevTinder@790", {
        expiresIn: "1d",
      });
      // console.log("Generated Token: ", token);

      // Correctly set the cookie
      res.cookie("token", token, {
        httpOnly: true,
        expires:"1d"
      });

      res.send("Login Successful!!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  console.log("Sending a connection request");

  res.send(`${user.firstName} : Send a connection request`);
});

// database connect

connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(7777, () => {
      console.log(`Server is successfully listing on PORT 7777....`);
    });
  })

  .catch((err) => {
    console.err(`${err} : Database cannot be connected!!`);
  });
