import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";

const connectDB = async () => {
    try {
        const response = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("DB connection successful")
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
}

export default connectDB;