const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Cart=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
    },
    quantity:{type:"number", required:true}
})


module.exports=mongoose.model('Cart',Cart)