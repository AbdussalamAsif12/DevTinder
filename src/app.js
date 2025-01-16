const express = require("express");
const connectDB = require("./config/database");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../src/models/models");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

const { validateSignUpData } = require("./utils/validation");
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
      const token = await jwt.sign({ _id: user._id }, "DevTinder@790");
      console.log("Generated Token: ", token);

      // Correctly set the cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });

      res.send("Login Successful!!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Invalid Token")
    }

    const decodeMessage = await jwt.verify(token, "DevTinder@790");
    const { _id } = decodeMessage;

    console.log("Logged In user is: " + _id);

    const user = await User.findById(_id);
    if(!user){
      throw new Error("Please Login Again")
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
});

// get email api

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User Not Found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send(`Some thing went wrong ${err.message}`);
  }
});

// get all api

app.get("/feed", async (req, res) => {
  const feed = await User.find({});
  res.send(feed);
});

// delete api

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("User delete Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// update api

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
    "password",
  ];

  // understand this code from here ----
  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID format");
    }

    // Validate update fields
    const invalidFields = Object.keys(data).filter(
      (k) => !ALLOWED_UPDATES.includes(k)
    );
    if (invalidFields.length > 0) {
      return res
        .status(400)
        .send(`Update not allowed for fields: ${invalidFields.join(", ")}`);
    }

    // to here----

    // Update user
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    // Check if user exists
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send(`User Update Failed: ${err.message}`);
  }
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
