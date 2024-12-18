const router = require("express").Router();

router.post("/userpost",(req,res)=>{
    const username = req.body.username;
    console.log(username)
})

module.exports = router;