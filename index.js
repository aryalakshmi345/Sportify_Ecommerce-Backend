require ('dotenv').config()
const express = require('express')
const cors=require('cors')
const router = require('./Routes/router')
require('./DB/Connection')


// create express application
const server= express()

// use middleware
server.use(cors())
server.use(express.json())
server.use(router)
server.use('/Uploads',express.static('Uploads'))

// set ports
const port=4000 || process.env.PORT

// start server
server.listen(port,()=>{
    console.log(`Express server is running on port ${port} and waiting for client request`);
})

// get response
server.get('/',(req,res)=>{
    res.send(`<h1>THE SREVER IS RUNNING......</h1>`)
})