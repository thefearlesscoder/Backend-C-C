
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
});

connectDB()  //after DB connection we set the app to listed the to the server at the port
.then(() => {
    app.listen(process.env.port || 8000, () =>{
        console.log(`server is running at port : ${process.env.port}`);
    })
})
.catch((error) => {
    console.log("MOngo db error ",error);}
)


/*
import express from "express";
const app = express();

(async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error)=>{
            console.log("Error connecting to MongoDB");
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is listeing at port ${process.env.PORT}`);
        })
    } catch(error){
        console.log(error);
        throw error;
    }
})()
    */