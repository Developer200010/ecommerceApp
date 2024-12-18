const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");  

mongoose
.connect(process.env.MONGO_URL)
.then(() => console.log("db is connected successfully"))
.catch((error) => console.error(error));

app.use(express.json());

//   calling routes 
const userRoute = require("./routes/user.js")
const authRoute = require("./routes/auth.js")

//   creating api
app.use("/api/auth", authRoute)
// app.use("/api/users",userRoute)


app.listen(process.env.PORT || 3000, () => {
  console.log(`server is running fine ${process.env.PORT}`);
});
