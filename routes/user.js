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
    const queryForLatestUser = req.query.new 
    try {
    const users = queryForLatestUser? await userModel.find().sort({_id:-1}).limit(4 ):await userModel.find();
    res.status(200).json(users);  
    } catch (error) {
        res.status(500).json(error)
    }
});

router.get("/stats", verifyTokenIsAdmin, async (req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));
    try {
        const data = await userModel.aggregate([
            {$match:{createdAt: { $gte : lastYear}}},
            {
                $project: {
                    month: {$month: "$createdAt"}
                },
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum:1}
                }
            }
        ]);
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

module.exports = router;