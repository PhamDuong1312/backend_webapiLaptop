const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Comment=new Schema({
    content:{type:"string", required:true},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
    }
    
},{
    timestamps:true,
})


module.exports=mongoose.model('Comment',Comment)