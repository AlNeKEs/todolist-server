const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const argon2 = require("argon2");

const user = require("../models/user");

// create new user
// private
router.post("/register", async (req, res) => {
  const { username, password, fullname } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "missing username or password" });
  }
  try {
    const newUsername = await user.findOne({ username });
    if (newUsername) {
      return res
        .status(400)
        .json({ success: false, message: "username already taken" });
    }
    const newPassword = await argon2.hash(password, process.env.ACCESS_TOKEN);
    const newUser = new user({
      username: username,
      password: newPassword,
      fullname: fullname || username,
      createAt: new Date(),
    });
    const saveUser = await newUser.save();
    if (saveUser) {
      return res
        .status(200)
        .json({ success: true, message: "register successful" });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: true, message: "Internal server error" });
  }
});

// login
//public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, message: "missing username" });
  }
  try {
    const User = await user.findOne({ username });
    if (!User) {
      return res
        .status(400)
        .json({ success: false, message: "incorrect username or password" });
    }
    const passwordValid = await argon2.verify(User.password, password);
    if (!passwordValid) {
      return res
        .status(400)
        .json({ success: false, message: "incorrect username or password" });
    }
    const token = jwt.sign(
      { userID: User._id, username: User.username },
      process.env.ACCESS_TOKEN
    );
    return res.status(200).json({
      success: true,
      message: "login successful",
      "access_token": token,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
