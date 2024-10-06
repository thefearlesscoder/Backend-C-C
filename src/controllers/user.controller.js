import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiErrors.js";
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();

        const refreshToken = user.generateRefeshToken();

        // user object hamne DB se liya hai aur iske under user ki sari properties hai
        /* ab in nayi values ko(refresh token aur access tokent ko user ke data mein add krna hai to in
        field ko bhi insert karenge*/
        user.refreshToken = refreshToken; //object mei new property add karenge
        user.save({validateBeforeSave: false}); //existing DB mein merge kr denge

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generatingrefresh and access token");
    }
}

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
    //option chaining mein error aa sakta hai --> then use simple if else.

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required");
    }

    // console.log("ABCDD")
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
    // console.log(createdUser ,"dfgfdfdg");
 
   if(!createdUser){
    throw new ApiError(500,"something went wrong while regidtering user");    
   }

   console.log("the user details are : ", user);    
   

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered succesfully")
   )

})

//user login
const loginUser = asyncHandler(async(req,res) => {
    //req body se data fetch
    //username or email
    //password check
    //access and refresh token
    //send cookie..

    const {username, email, password} = req.body;

    if(!username || !email){
        throw new ApiError(400, "username or email requied");
    }
    //find (from DB) user based on email or username using &or
    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User not found");
    }

    //check password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password");
    }

    //generate tokens
    /*we will be required to generate the tokens many times so wecan creae seperaye methos
    to generaye both the tokens at the same time*/

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    //send in cookies
    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, 
                {
                user: loggedInUser, accessToken, refreshToken
        
                },
                
                "user is logged in successfully"
        )
        )

})

const logoutUer = asyncHandler( async(req,re)=>{

    //user obejct se user id milegi aur us id ko use krke access token ko delee kr denge and thats logout...
    await User.findByIdandUpdate(
        req.user._id, 
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {
            new: true,
        }
    )

    // ab logout ke baad naya cookie set karenge
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged Out"))
})

export { registerUser ,
     loginUser,
    logoutUser}