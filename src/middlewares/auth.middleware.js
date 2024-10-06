import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req,res,next) => {
    try { //database operation hain fali ho sakta hai isiliye try catch mein likha...
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Brearer ","")
    
        if (!token) {
            throw new ApiError(401,"unothorised request");        
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            //TODo : discuss about frontEnd.
            throw new Error(401,"Invalid access token");        
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid acces token");        
    }
    
})