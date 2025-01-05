const express = require("express");

const app = express();

app.use("/",(req,res)=>{
    res.send("Admin Dashboard")
})


app.listen(3000,()=>{
    console.log(`SERVER is successfully listing on 3000`);
    
})