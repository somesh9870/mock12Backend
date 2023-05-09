const express = require("express");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

// to register a new user
userRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    // to check if user is already registered
    const emailExists = await UserModel.findOne({ email: email });

    if (emailExists) {
      res.status(403).send({ msg: "Email already exists" });
    }

    bcrypt.hash(password, 4, async (err, hash) => {
      const payload = {
        email,
        password: hash,
      };

      const user = new UserModel(payload);
      await user.save();

      res.status(200).send({ msg: "Registration successful" });
    });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

// to login the user
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          res.status(200).send({
            msg: "Login successful",
            token: jwt.sign({ userID: user._id }, "masai"),
          });
        } else {
          res.status(403).send({ msg: "Incorrect password" });
        }
      });
    } else {
      res.status(403).send({ msg: "User not found! Please register first" });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

module.exports = userRouter;
