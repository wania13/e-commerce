var express = require('express')
var router = express.Router()
const {signoutroute,signuproute,signinroute,isSignedIn} =require("../controllers/auth.js")

//incluing express validiator in signup route
const { check, validationResult } = require('express-validator');

router.get('/signout',signoutroute)

router.post('/signup',
    [
        check('name',"name should be 3 chars").isLength({min:3}),
        check('email',"please provide complete email").isEmail(),
        check('password',"password should be more than 3").isLength({min:3})
    ]
    ,signuproute
);


router.post('/signin',
        [
            check('email',"please provide complete email for signin").isEmail(),
            check('password',"please provide password").isLength({min:3})
        ]
        ,signinroute
);

router.get('/testroute',isSignedIn,(req,res)=>{
    // res.send("A protected route")
    res.json(req.auth)
});






module.exports=router