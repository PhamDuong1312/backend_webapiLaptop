const mongoose = require('mongoose')

const Schema = mongoose.Schema

const User=new Schema({

    fullName:{type:"string",require:true},
    email:{type:"string",require:true},
    password:{type:"string",require:true},
    isAdmin:{type:"boolean",default:false}
},{
    timestamps:true,
})


module.exports=mongoose.model('User',User)