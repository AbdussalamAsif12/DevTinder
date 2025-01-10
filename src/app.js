const express = require("express");
const connectDB = require("./config/database");
const User = require("../src/models/models")
const app = express();

app.use(express.json())

// Post api
app.post("/signup", async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send(`Error saving the user ${err.message}`);
  }
});


// get email api


app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.find({ emailId: userEmail })
    if (user.length === 0) {
      res.status(404).send("User Not Found")
    }
    else {
      res.send(user)
    }

  } catch (err) {
    res.status(400).send(`Some thing went wrong ${err.message}`);
  }


})

// get all api

app.get("/feed", async (req, res) => {
  const feed = await User.find({});
  res.send(feed)
})

// delete api

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {

    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("User delete Successfully")

  } catch (err) {
    res.status(400).send("Something went wrong")
  }
})

// update api

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    // const user = await User.findByIdAndUpdate(userId, data);
    res.send(user)

  } catch (err) {
    res.status(400).send(`Something went wrong ${err.message}`)
  }
})



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
