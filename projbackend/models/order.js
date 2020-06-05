const mongoose=require('mongoose')

const {ObjectId}=mongoose.Schema


const ProductCartSchema= mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"product",
    },

    name:String,
    count:Number,
    price:Number,
})




const orderSchema=new mongoose.Schema({

    products:[ProductCartSchema],
    transaction_id:{},
    amount:Number,
    status:{
        type:String,
        default:"Recieved",
        enum:["Recieved","Cancelled","Processing","Shipped","Delivered"]
    },
    updated:Date,
    address:String,
    user:{
        type:ObjectId,
        ref:"User",
    }
    
},{timestamps:true}
)


const order=mongoose.model('order',orderSchema);
const orderedproduct=mongoose.model('orderedproduct',ProductCartSchema);

module.exports={order,orderedproduct};