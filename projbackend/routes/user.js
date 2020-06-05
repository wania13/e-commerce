const express=require('express')
const router=express.Router()

const {getUserById,getUser,getAllusers,updateUser,getOrderList}=require('../controllers/user.js')
const {isSignedIn,isAuthenticated,isAdmin}=require('../controllers/auth.js')

router.param('userId',getUserById)//its a param middleware that brings req.profile
router.get('/users',getAllusers)//just for practice
router.get('/user/:userId',isSignedIn,isAuthenticated,getUser)
router.put('/user/:userId',isSignedIn,isAuthenticated,updateUser)
router.get('orders/user/:userId',isSignedIn,isAuthenticated,getOrderList)



module.exports=router