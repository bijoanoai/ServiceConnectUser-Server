const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const connectDB =require('./config/dbConnection')
const dotenv = require("dotenv");
dotenv.config();
const app=express()

connectDB();
app.use(bodyParser.json())
app.use(cors())
const routes=require('./routes/router');
app.use('/serviceConectUser',routes)
const PORT = process.env.PORT || 3000;
app.listen(PORT,err=>{
    if(err)
        console.log(err);
    else
    console.log('Server Running at 3000 port');
    
        
})
