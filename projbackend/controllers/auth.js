const User=require("../models/user.js");
var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');

//incluing express validiator in signup route
const { check, validationResult } = require('express-validator');

exports.signuproute=(req,res)=>{

    var errors=validationResult(req) //binds to req
    if(!errors.isEmpty()){
        //validationresults comes up in an array 
        //middleware error before accessing controller
        errors=errors.array() 
        var length=errors.length
        var myerrors=[]
        var myparams=[]
        for (var i=0;i<length;i++){
            myerrors[i]=errors[i].msg
            myparams[i]=errors[i].param
        }

        return res.status(422).json({
                error:myerrors,
                params:myparams,
        })
    }

    const user=new User(req.body)
    user.save((err,user)=>{

        //errors related to user model
        if(err){
            return res.status(400).json({
                error:"user already exist! not able to store the user",
            })
        }

        res.json({
            "name":user.name,
            "email":user.email,
            "_id":user._id,
        })
    })
};




exports.signoutroute=(req,res)=>
{   
    res.clearCookie("token")
    res.json({
        message:"youu signout !"
    });
};


exports.signinroute=(req,res)=>{

    var errors=validationResult(req) //binds to req
    if(!errors.isEmpty()){

        errors=errors.array()[0] //validationresults comes up in an array whose first object contains all info
        return res.status(422).json({
            errormsg:errors.msg,
            param:errors.param

        })
        
    }
    

    const {email,password}=req.body; //fetching values from body

    //finding the email fetched in our model
    //acceccing the info of desired user through this
    User.findOne({email},(err,user)=>{

        //if no user is found or we come up with some model database errors
        if(err || !user){
            return res.status(400).json({
                error:"Email is not found! Please signup",
            })
        }
    
        //match the password
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email or password is incorrect",
            })
        }

        //creating token
        var token = jwt.sign({ _id: user._id }, process.env.SECRET);

        //putting token in cookie
        res.cookie("token",token,{expire:new Date()+9999});

        //finally sending all required things in response
        const {_id,name,email,role}=user
        return res.json({
            token,
            user:{_id,name,email,role},
        })

    })
};


//protected routes (middleware of express)
//decodes the present token using secret and returns id
exports.isSignedIn=expressjwt({
    secret:process.env.SECRET,
    userProperty:"auth" //the actual id 
});


//custom middlewares

//req.profile is the id from frontend url through param
exports.isAuthenticated=(req,res,next)=>{
    let checker= req.profile && req.auth && req.profile._id==req.auth._id 
    if (!checker){
        res.send(403).json({
            error:"ACCESS DENIED"
        })
    }
    next()
}

exports.isAdmin=(req,res,next)=>{
    if (req.profile.role==0){
        res.send(403).json({
            error:"ACCESS DENIED"
        })
    }
    next()
}