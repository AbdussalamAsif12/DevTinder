const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connection.model");
const USER_SAVE_DATA = "firstName lastName age photoUrl gender skills";
// Get all the pending/interested connection requests for the loggedIn User

userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id, // find logged in user id and those connection that are attached to other's ex : user A interested in elon musk user B is interested in elon musk
      //   or the logged in user check who send me interesting req or who is interested in me
      status: "interested",
    }).populate("fromUserId", USER_SAVE_DATA);
    res.json({ message: "Data Fetch Successfully", data: pendingRequest });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// get all accepted req which i send to User A and all accepted req which User B send to me

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAVE_DATA)
      .populate("toUserId", USER_SAVE_DATA);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = userRouter;
