const jwt = require("jsonwebtoken");
require("dotenv").config()

const verifyToken = (req,res, next) =>{
    const authHeader = req.headers.token;
    if(authHeader){
        jwt.verify(token, process.env.JWT_SEC, (err, user)=>{
            if(err) res.status(403).json("Token is not valid");
            req.user = user;
            next()
        })
    }else{
        return res.status(401).json("you are not authenticated");
    }
}

module.exports = verifyToken;