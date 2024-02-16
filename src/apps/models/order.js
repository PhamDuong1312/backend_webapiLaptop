const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Order=new Schema({
    items:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"OrderItem",
        required:true

    }],
    fullname:{type:String, required:true},
    address:{type:String, required:true},
    city:{type:String, required:true},
    phone:{type:String, required:true},
    email:{type:String, required:true},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    totalPrice:{type:Number},
    dateOrder:{type:Date, default:Date.now},
    status:{type:String, default:"pending"},
    notes:{type:String, default:"Không có"},
    pay:{type:String, default:"cod"}



},{
    timestamps:true,
})


module.exports=mongoose.model('Order',Order)