const express = require("express");
const request = express.Router();

const { userAuth } = require("../middleware/auth");


request.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  console.log("Sending a connection request");

  res.send(`${user.firstName} : Send a connection request`);
});

module.exports = request;
