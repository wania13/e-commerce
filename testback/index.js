const express = require("express")
const app = express()
const port=8000

app.get('/',(req,res)=>{return res.send('welcome to home page');})

app.get('/login',(req ,res)=>{return res.send('please log in')})

app.get('/signin',(req,res)=>{return res.send('you are on sign in page')})



const adminroute=(req,res)=>{return res.send("yahoooo welcome admin! :P")}
const isAdmin=(req,res,next)=>{
    console.log('checking whether its an admin or nottt ')
    next();
}

const isloggedin=(req,es,next)=>{
    console.log("checking whether its log in or not ?")
    next();
}


app.get('/admin',isAdmin,isloggedin,adminroute)

app.listen(port,()=>console.log('server is on ..'))