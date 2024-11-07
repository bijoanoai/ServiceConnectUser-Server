const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const db =require('./dbConnection')
const dotenv = require("dotenv");
dotenv.config();
const app=express()


app.use(bodyParser.json())
app.use(cors())
const routes=require('./router')
app.use('/serviceConectUser',routes)

app.listen(3000,err=>{
    if(err)
        console.log(err);
    else
    console.log('Server Running at 3000 port');
    
        
})
