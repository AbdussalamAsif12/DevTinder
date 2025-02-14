const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; // login user coming from middeware
    // console.log(user.firstName)
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user; // logged in user
    
    // left side user already login -- // right side user came from body right now
    // loggedInUser.firstName = req.body.firstName;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key])); // replace upcoming input data to already login data

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    // Validate input
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both old and new passwords are required." });
    }

    const isPasswordValid = await req.user.validatePassword(oldPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Incorrect old password." });
    }

    if (await bcrypt.compare(newPassword, req.user.password)) {
      return res.status(400).json({
        error: "New password must not be the same as the old password.",
      });
    }

    req.user.password = await bcrypt.hash(newPassword, 10);
    await req.user.save();
    res.json({
      message: `${req.user.firstName}, your password has been updated successfully.`,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
