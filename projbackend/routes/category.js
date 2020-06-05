const express=require('express')
const router=express.Router()

const {getCategoryById,getCategory,getAllCategories,createCategory,updateCategory,removeCategory}=require('../controllers/category')
const {isAuthenticated,isSignedIn,isAdmin}=require('../controllers/auth')
const {getUserById}=require('../controllers/user')


//params
router.param('userId',getUserById)//its a param middleware that brings req.profile
router.param('categoryId',getCategoryById)//its a param middleware that brings category by id

//actual category routes

//create
router.post('/category/create/:userId',isSignedIn,isAuthenticated,isAdmin,createCategory)

//read
router.get('/category/:categoryId',getCategory)
router.get('/categories',getAllCategories)


//update
router.put('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,updateCategory)


//delete
router.delete('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,removeCategory)




module.exports=router