import dotenv from "dotenv"
import express from "express";
import connectDB from "./dp/index.js";

dotenv.config({
    path: './.env'
})

const app = express();



connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️  Server is running at port: ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!!", err);
    });















/*
import express from "express";
const app = express();
(async()=>{
    try{
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error",(error)=>{
        console.log("ERROR",error)
        throw error
    })
    app.listen(process.env.PORT,()=>{
        console.log(`App is running on port ${process.env.PORT}`)
    })
    }
    catch(error){
        console.error("Error",error)
        throw error
    }
})()
    */