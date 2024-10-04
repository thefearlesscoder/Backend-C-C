import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiErrors.js";
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { fullname, username, email, password } = req.body;
    console.log(email);

    // if(fullname == ""){
    //     throw new ApiError(400, "full name is required")
    // }
    if (
        [fullname, email, username, password].some((field) => (typeof field === 'string' && field.trim() === "") || !field)

    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "user already exists");
    }

    const avatarLocalPath =  req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required");
    }

    console.log("ABCDD")
    //upload them to cloudinary
   const avatar =  await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   console.log("skfkdjfldf");
   

   if(!avatar){
       throw new ApiError(400, "avatar is required");
   }

   const user = await User.create({
       fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "" ,
    username : username.toLowerCase(),
    email,
    password,
   })

   const createdUser = await User.findById(user._id).select("-password -refreshToken");
    console.log(createdUser ,"dfgfdfdg");
 
   if(!createdUser){
    throw new ApiError(500,"something went wrong while regidtering user");    
   }

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered succesfully")
   )

})

export { registerUser }