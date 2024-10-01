import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, //urls from where the backend will accecpt the request
    credentials: true,
}));

app.use(express.json({limit: "16kb"})) //form etc ka data aise parse hoga
app.use(express.urlencoded({
    extended: true, limit: "16kb",
})) // for parsing from URL
app.use(express.static("public")) // files aur forlder we want to keep in local/ acvailbe directly
app.use(cookieParser()) // to parse cookies

//routes import

import userRouter from "./routes/user.routes.js" //man chahe nam se tabhi import kr sakte hain jab export default hua ho

//routes declaration
app.use("/api/v1/users", userRouter)

//https://localhost:8000/api/v1/users/.....

export { app };