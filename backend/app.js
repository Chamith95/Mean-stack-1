const express =require('express');
const path=require("path");
const bodyparser=require('body-parser');
const mongoose=require("mongoose");

const postsRoutes =require("./routes/posts");
const userRoutes =require("./routes/user");
const liqourRoutes =require("./routes/liqour");

const app =express();

mongoose.connect("mongodb+srv://max:As8M56aPz3NMamAz@cluster0-n8moq.mongodb.net/node-angular-tu?retryWrites=true",{ useNewUrlParser: true })
.then(()=>{
    console.log("Connected to database!")
})
.catch(()=>{
    console.log("Connection failed!")
});
mongoose.set('useCreateIndex', true)

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}))
app.use("/images",express.static(path.join("backend/images")));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE,OPTIONS")
    next();
});

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);
app.use("/api/liqour",liqourRoutes);

module.exports=app;