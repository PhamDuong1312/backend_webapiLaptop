const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Blog=new Schema({
    title:{type:String,required:"true"},
    header:{type:String,required:"true"},
    notes:{type:String,required:"true"},
    image:{type:"string",required:"true"},
    tags:{type:"string",required:"true"},
    content:{type:"string",required:"true"},
},{
    timestamps:true
})


module.exports=mongoose.model('Blog',Blog)