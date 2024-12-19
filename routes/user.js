const router = require("express").Router();
const {verifyToken, verifyTokenAuthorization, verifyTokenIsAdmin} = require("./verifyToken");
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

// delete

router.delete("/:id", verifyTokenAuthorization, async(req,res)=>{
    try {
        await userModel.findByIdAndUpdate(req.params.id);
        res.status(200).json("user has been deleted!")
    } catch (error) {
        
    }
});

// getting Admin as user

router.get("/find/:id", verifyTokenIsAdmin, async(req,res)=>{
    try {
       const user = await userModel.findById(req.params.id);
       const {password, ...others} = user._doc; 
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
});


// getting all users
router.get("/",verifyTokenIsAdmin, async (req,res)=>{
    try {
    const users = await userModel.find();
    res.status(200).json(users);  
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;