const Product=require('../models/product.js')
const formidable = require('formidable');
var _ = require('lodash');
const fs=require('fs')



exports.getProductById=(req,res,next,id)=>{
    Product.findById(id)
    .populate('category')
    .exec((err,product)=>{
        if (err || !product){
             res.status(400).json({
                error:"product is not found"
            })
        }
        req.product=product
        console.log(req.body)
        next()
    })

}

exports.createProduct=(req,res)=>{
    let form=formidable.IncomingForm()
    form.keepExtentions=true

    form.parse(req,(err,fields,file)=>{
        if (err || !fields){
            return res.status(400).json({
                error:"problem with images"
            })
        }

        //destructuring the fields
        const {name,price,category,description,stock}=fields

        //checking all fields must be there to store in database
        if (!name || !price || !category || !description || !stock){
            return  res.status(400).json({
                error:"please enter complete info"
            })
        }

        let product=new Product(fields)

        //handle file here (photo)
        if(file.photo){
            if (file.photo.size>3000000){
                return  res.status(400).json({
                    error:"image too big"
                })
            }
            product.photo.data=fs.readFileSync(file.photo.path)
            product.photo.contentType=file.photo.type
        }

        //save to db
        product.save((err,product)=>{

            if (err){
                return  res.status(400).json({
                    error:"can't save product :("
                })

            }
            res.json(product)
        })

    })
}


exports.getProduct=(req,res)=>{
    req.product.photo=undefined
    return res.json(req.product)
}

//middleware for loading images
exports.loadPhoto=(req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}


exports.deleteProduct=(req,res)=>{
     let product=req.product
     product.remove((err,deletedproduct)=>
        {
            if (err || !deletedproduct){
                console.log(err)
                return res.status(400).json({
                error:"unable to delete product"
            })
            }
            
            res.json({
             message:`${deletedproduct.name} is successfully deleted`
            })
        }
    )
}

exports.updateProduct=(req,res)=>{
    let form=formidable.IncomingForm()
    form.keepExtentions=true

    form.parse(req,(err,fields,file)=>{
        if (err || !fields){
            return res.status(400).json({
                error:"problem with images"
            })
        }

        //updation code
        let product=req.product //grabing the product to get info of the un-updated product
        product=_.extend(product,fields) //changing the fields of the grabed objects

        //handle file here (photo)
        if(file.photo){
            if (file.photo.size>3000000){
                return  res.status(400).json({
                    error:"image too big"
                })
            }
            product.photo.data=fs.readFileSync(file.photo.path)
            product.photo.contentType=file.photo.type
        }


        //save to db
        product.save((err,product)=>{

            if (err){
                return  res.status(400).json({
                    error:"updation failed :("
                })

            }
            res.json(product)
        })

    })
}



exports.getAllProducts=(req,res)=>{

    let limit=req.query.limit ? parseInt(req.query.limit):8
    let sortBy=req.query.sortBy ? req.query.sortBy:"_id"

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if (err || !products){
            return res.status(400).json({
                error:"No product is found"
            })
        }

        res.json(products)
    })
}



//get all categories alternative for what we coded in category controller
exports.getAllCategories=(req,res)=>{
    Product.distinct(category,{},(err,category)=>{
        if (err || !category){
            return res.status(400).json({
                error:"No category is found"
            })
        }

        res.json(category)
    })
}










//middleware for updating stock and sold
exports.updateInventory=(req,res,next)=>{
    let myOperations=req.body.order.products.map(prod=>{
        return {
            updateOne:{
                filter:{_id:prod._id},
                update:{$inc:{stock:-prod.count,sold:+ prod.count}}
            }
        }
    })
    Product.bulkWrite(myOperations,{},(err,products)=>{
        if (err || !products){
            return res.status(400).json({
                error:"bulk operation failed"
            })
        }
      next()
    })
}