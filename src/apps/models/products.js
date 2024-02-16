const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Product=new Schema({
    name:{type:"string",required:"true"},
    price:{type:"number",required:"true"},
    baoHanh:{type:"string",required:"true"},
    phuKien:{type:"string",required:"true"},
    image:{type:"string",required:"true"},
    giamGia:{type:Number,default:0},
    tinhTrang:{type:"string",required:"true"},
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:"true"
    },
    status:{type:Boolean,default:true},
    noiBat:{type:Boolean,default:false},
    description:{type:"string",required:"true"},
},{
    timestamps:true
})


module.exports=mongoose.model('Product',Product)