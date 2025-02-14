const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connection.model");
const User = require("../models/user.model");
const USER_SAVE_DATA = "firstName lastName age photoUrl gender skills";
// Get all the pending/interested connection requests for the loggedIn User

userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id, // give me all those fields where my logged user id exist in toUserId field
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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;

    // Find All Users on your feed but exclude yourself means the loggedIn User
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId , toUserId");

    // put all user in set these user cannot be see on feed
    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    // these users can be see
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAVE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
