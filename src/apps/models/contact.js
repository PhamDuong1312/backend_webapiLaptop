const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Contact=new Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:false
    },
},{
    timestamps:true
})


module.exports=mongoose.model('Contact',Contact)