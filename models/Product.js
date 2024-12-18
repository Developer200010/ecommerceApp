const mongoose= require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title : {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            require: true,
        },
        img: {
            type: String,
            required:true
        },
        categories:{
            type: Array
        },
        size:{
            type: boolean,
        },
        color:{
            type: boolean,
        },
        price:{
            type: boolean,
            default: false,
        },
    },
    { timestamps : true }
)

module.exports = mongoose.model("product", productSchema)