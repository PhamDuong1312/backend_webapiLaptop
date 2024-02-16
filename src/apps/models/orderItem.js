const mongoose = require('mongoose')

const Schema = mongoose.Schema

const OrderItem=new Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    quantity:{type:"number", required:true}
})


module.exports=mongoose.model('OrderItem',OrderItem)