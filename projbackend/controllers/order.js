const {Order,orderedproduct}=require('../models/order')

exports.getOrderById=(req,res,next,id)=>{
    Order.findById(id)
    .populate("products.product","name price")
    .exec((err,order)=>{
        if (err || !order){
            res.status(400).json({
                error:"no order found :("
            })
        }
        req.order=order
    })
    
    
    next()
}


exports.createOrder=(req,res)=>{
    req.body.order.user=req.profile
    const order=new Order(req.body.order)
    order.save((err,order)=>{
        if (err || !order){
            res.status(400).json({
                error:"unable to create order :("
            })
        }
       res.json(order)
    })
}

exports.getAllOrders=(req,res)=>{
    Order.find()
    .populate("user","_id name")
    .exec((err,orders)=>{
        if (err || !orders){
            res.status(400).json({
                error:"No order in db :("
            })
        }
       res.json(orders)
    })
}


exports.getStatus=(req,res)=>{
    res.json(Order.schema.path('status').enumValues)
}



exports.updateStatus=(req,res)=>{
    Order.update(
        {_id:req.body.orderId},
        {$set:{status:req.body.status}},
        {new:true},
        (err,updatedorder)=>{
            if (err || !updatedorder){
                res.status(400).json({
                    error:"No order in db :("
                })
            }
           res.json(updatedorder)
        }
    )
}