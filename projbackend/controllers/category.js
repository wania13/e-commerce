const Category=require('../models/category')


exports.getCategoryById=(req,res,next,id)=>{
    Category.findById(id).exec((err,cate)=>{
        if (err || !cate){
            res.status(400).json({
                error:"category not found in db"
            })
        }

        req.category=cate
        next()
    })
}

exports.createCategory=(req,res)=>{
    const category=new Category(req.body)
    category.save((err,cate)=>{
        if (err || !cate){
            return res.status(400).json({
                error:"problem in storing category"
            })
        }

        res.json(cate)
    })
}


exports.getCategory=(req,res)=>{
    res.json(req.category)
}

exports.getAllCategories=(req,res)=>{
    Category.find().exec((err,categories)=>{
        if (err || !categories){
            return res.status(400).json({
                error:"No category is found"
            })
        }

        res.json(categories)
    })
}


exports.updateCategory=(req,res)=>{
    Category.findByIdAndUpdate(
        {_id:req.category._id},
        {$set:{name:req.body.name}},
        {new:true},
        (err,updatedcate)=>{
            if (err || !updatedcate){
                return res.status(400).json({
                    error:"unable to update category"
                })
            }
    
            res.json(updatedcate)
        }
    )
}


exports.removeCategory=(req,res)=>{
    const category=req.category
    category.remove((err,category)=>{
        if (err || !category){
            return res.status(400).json({
                error:"unable to delete"
            })
        }

        res.json({
            message:`${category.name} category is successfully deleted`
        })
    
    })
}