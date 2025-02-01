const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connection.model");
// Get all the pending/interested connection requests for the loggedIn User

userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id, // find logged in user id and those connection that are attached to other's ex : user A interested in elon musk user B is interested in elon musk
      //   or the logged in user check who send me interesting req or who is interested in me
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "photoUrl",
      "gender",
      "skills"
    ]);
    res.json({ message: "Data Fetch Successfully", data: pendingRequest });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = userRouter;
