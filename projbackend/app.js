const mongoose=require('mongoose')
const express = require('express')
require('dotenv').config()
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var cors = require('cors')

//requiring routes files
const authRoutes=require("./routes/auth.js")
const userRoutes=require("./routes/user.js")
const categoryRoutes=require("./routes/category.js")
const productRoutes=require('./routes/product.js')
const orderRoutes=require('./routes/order.js')




const app= express()

//middlewares
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors())



//my Routes (prefixing the routes)
app.use('/api',authRoutes)
app.use('/api',userRoutes)
app.use('/api',categoryRoutes)
app.use('/api',productRoutes)
app.use('/api',orderRoutes)



//for connecting with database
mongoose.connect(process.env.DATABASE,
    {  useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true,
    }   ).then(()=>{console.log("DB IS CONNECTED")});



//port
const port=process.env.PORT || 8000;


//for connecting with port ...starting a server
app.listen(port,()=>{
    console.log(`app is running at ${port}`)
})