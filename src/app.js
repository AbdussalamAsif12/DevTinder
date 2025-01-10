const express = require("express");
const connectDB = require("./config/database");
const User = require("../src/models/models")
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Ahmad",
    lastName: "Asif",
    emailId: "Ahmad@asif.com",
    password: "Ahmad123js",
  });

  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send(`Error saving the user ${err.message}`);
  }
});

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
