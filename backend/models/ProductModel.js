const mongoose = require("mongoose")

 const ProductSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true,
    },
    slug:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required: true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    quantity:{
        type:Number,
        required:true
    },
    photo:{
        data:Buffer,
        contentType:String,
    },
    shipping:{
        type:Boolean,

    }
 }, {timestamps: true})


 module.exports = mongoose.model("Product", ProductSchema);