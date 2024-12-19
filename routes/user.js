const router = require("express").Router();
const {verifyToken, verifyTokenAuthorization} = require("./verifyToken");
const cryptoJs = require("crypto-js");
const userModel = require("../models/User.js")
require("dotenv").config();


router.put("/:id", verifyToken,async (req,res)=>{
    if(req.body.password){
        req.body.password = cryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }

    try {
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new: true})

        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;