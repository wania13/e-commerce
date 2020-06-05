const mongoose=require('mongoose')

const {ObjectId}=mongoose.Schema

const productSchema=new mongoose.Schema({

    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32,
    },

    price:{
        type:Number,
        maxlength:32,
        trim:true,
        required:true,
    },

    description:{
        type:String,
        trim:true,
        required:true,
        maxlength:2000,
    },

    category:{
        type:ObjectId,
        ref:'Category',
    },

    sold:{
        type:Number,
        default:0,
    },

    stock:{
        type:Number,
    },

    photo:{
        data:Buffer,
        contentType:String,
    }














},{timestamps:true})


module.exports=mongoose.model('product',productSchema);