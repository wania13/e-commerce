const express=require('express')
const router=express.Router()

const {getProductById,createProduct,getProduct,loadPhoto,updateProduct,deleteProduct,getAllProducts}=require('../controllers/product.js')
const {isSignedIn,isAuthenticated,isAdmin}=require('../controllers/auth.js')
const {getUserById}=require('../controllers/user.js')
 
//params
router.param('userId',getUserById)
router.param('productId',getProductById)


//actual routes

//create 
router.post('/product/create/:userId',isSignedIn,isAuthenticated,isAdmin,createProduct)

//read
router.get('/product/:productId',getProduct)
router.get('/product/photo/:productId',loadPhoto)
//read all
router.get('/products',getAllProducts)

//update
router.put('/product/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,updateProduct)

//delete
router.delete('/product/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteProduct)




module.exports=router