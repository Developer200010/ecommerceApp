const router = require("express").Router();
const userModel = require("../models/User.js");
// const bcrypt = require("bcryptjs");
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
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
    !loggedUser && res.status(401).json("Wrong Crendentials!")
    const hashedPassword = cryptoJs.AES.decrypt(loggedUser.password, process.env.PASS_SEC)
    const Opassword = hashedPassword.toString(cryptoJs.enc.Utf8);
    Opassword !== req.body.password && res.status(401).json("Wrong Crendentials!");

    const accessToken = jwt.sign(
        {
            id:loggedUser._id,
            isAdmin: loggedUser.isAdmin
        },
        process.env.JWT_SEC,
        {expiresIn:"1d"}
    )

    const {password, ...others} = loggedUser._doc;
    res.status(200).send({...others, accessToken});
  } catch (error) {}
});

module.exports = router;
