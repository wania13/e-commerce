const express=require('express')
const router=express.Router()

const {isAuthenticated,isSignedIn,isAdmin}=require('../controllers/auth')
const {getUserById,pushOrderInPurchaseArray}=require('../controllers/user')
const {updateInventory}=require('../controllers/product')
const {getOrderById,createOrder,getAllOrders,getStatus,updateStatus}=require('../controllers/order')

//param
router.param('orderId',getOrderById)
router.param('userId',getUserById)


//create
router.post('/order/create/:userId',isSignedIn,isAuthenticated,pushOrderInPurchaseArray,updateInventory,createOrder)

//read
router.get('/order/all/:userId',isSignedIn,isAuthenticated,isAdmin,getAllOrders)

//status read and update
router.get('/order/status/:userId',isSignedIn,isAuthenticated,isAdmin,getStatus)
router.get('/order/:orderId/status/:userId',isSignedIn,isAuthenticated,isAdmin,updateStatus)





module.exports=router