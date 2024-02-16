const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CommentBlog=new Schema({
    content:{type:"string", required:true},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    blog:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog",
        required:true,
    }
    
},{
    timestamps:true,
})


module.exports=mongoose.model('CommentBlog',CommentBlog)