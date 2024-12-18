const router = require("express").Router();
const userModel = require("../models/User.js");
// const bcrypt = require("bcryptjs");
const cryptoJs = require("crypto-js");
require("dotenv").config();
// register

router.post("/register", async (req, res) => {
  let { username, email, password } = req.body;
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(username,salt);
  const user = new userModel({
    username,
    email,
    password: cryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    const newUser = await user.save();
    res.status(200).send(newUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const loggedUser = await userModel.findOne({ email: req.body.email });
    console.log(loggedUser)
    !loggedUser && res.status(401).json("Wrong Crendentials!")
    const hashedPassword = cryptoJs.AES.decrypt(loggedUser.password, process.env.PASS_SEC)
    const password = hashedPassword.toString(cryptoJs.enc.Utf8);
    console.log(password)
    password !== req.body.password && res.status(401).json("Wrong Crendentials!");
    res.status(200).send(loggedUser);
  } catch (error) {}
});

module.exports = router;
