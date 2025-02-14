const express = require("express");
const request = express.Router();
const ConnectionRequest = require("../models/connection.model");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user.model");

request.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    //  User sending interest or ignored status to other user's or friends

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json(`message : Invalid Status Type ${status}`);
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res
        .status(400)
        .send({ message: `Connection Request Already Exist` });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.json({
      // logged in user all details in req
      // toUser : user already in database
      message: `${req.user.firstName} send ${status} status to ${toUser.firstName}`,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// change the interested status already in dbs in to the accpeted or rejected

request.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      // check the user sending status only accpeted and reject 
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!" });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        // checking 3 conditions =>
        _id: requestId, // find the request id the user A send to user B
        toUserId: loggedInUser._id, // this request belongs to this user A or B
        status: "interested", // status will be interested
      });
      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Connection Request " + status, data,toUserId: loggedInUser._id });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);



module.exports = request;
