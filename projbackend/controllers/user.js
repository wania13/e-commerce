const User=require("../models/user.js");
const Order=require("../models/order")

//this method will work with params fetch info from url ...behaves like middleware 
exports.getUserById=(req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            res.status(400).json({
                error:"no user was found in db"
            })
        }
        req.profile=user
        next()
    })
}

exports.getUser=(req,res)=>{
    
    req.profile.encry_password=undefined
    req.profile.salt=undefined
    req.profile.createdAt=undefined
    req.profile.updatedAt=undefined

    return res.json(req.profile)
}

//just for practice
exports.getAllusers=(req,res)=>{
    User.find().exec((err,users)=>{
        if (err || !users){
            res.status(400).json({
                error: "no user found !"
            })
        }

        res.json(users)
    })
}

exports.updateUser=(req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new: true,findOneAndUpdate:false},
        (err,user)=>{
            if(err || !user){
                res.status(400).json({
                    error:"problem in updation"
                })
            }

            user.encry_password=undefined
            user.salt=undefined
            user.createdAt=undefined
            user.updatedAt=undefined

            res.json(user)
        }
    )
}


//TODO:will come back here to understand

//fetching all info from order model related to specific user
exports.getOrderList=(req,res)=>{
    Order.find({user:req.profile._id})
    .populate("user","_id name")
    .exec((err,order)=>{
        if (err || !order){
            res.status(400).json({
                error:"no order found!"
            })
        }
        res.json(order)
    })
}

//pushing ordered items in user model purchase array
exports.pushOrderInPurchaseArray=(req,res,next)=>{

    let purchaselist=[]
    req.body.order.products.forEach(item=>{
         purchaselist.push({
            _id:item._id,
            name:item.name,
            description:item.description,
            category:item.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
         });
    });

    //pushing in db
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchaselist}},
        {new:true},
        (err,purchases)=>{
            if (err || !order){
                return res.status(400).json({
                    error:"unable to save purchase list!"
                })
            }
            next()
        }
    ) 
}