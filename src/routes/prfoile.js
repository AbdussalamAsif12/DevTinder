const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middleware/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (err) {
      console.error(err.message);
      res.status(403).json({ error: "Invalid or expired token" });
    }
  });
  


module.exports = profileRouter;