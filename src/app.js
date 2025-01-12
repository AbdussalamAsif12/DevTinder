const express = require("express");
const connectDB = require("./config/database");
const User = require("../src/models/models");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());

// Post api
app.post("/signup", async (req, res) => {
  const { emailId } = req.body;

  // Check if the email is already registered (this is a business rule)
  const existingUser = await User.findOne({ emailId });
  if (existingUser) {
    return res.status(400).send("Email already registered");
  }

  try {
    const user = new User(req.body); // Create a new user from the validated body
    await user.save(); // Save to the database
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send(`Error saving the user: ${err.message}`);
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
    "password"
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
