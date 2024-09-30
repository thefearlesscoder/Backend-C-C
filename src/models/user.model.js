import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true, // to make searcheable in mongo DB in optimised way
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [emailValidator, "Please enter a valid email address"],
    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        index: true, // to make searcheable in mongo DB in optim
    },
    avatar:{
        type: String, // cloudinary service
        required: true,
    },
    coverImage:{
        type:String,
    },
    watchHistory:{
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    password:{
        type: String,
        required: [true, "password is required"],
        minlength: 8,
        // select: false, // to hide this field in response
    },
    refreshToken:{
        type: String,
        // select: false, // to hide this field in response
    }

}, {timestamps:true});

//using pre hook -> middleware , data save se pehle data encrypt krna
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    //else
    this.password = bcrypt.hash(this.password, 10) // 10 hash rounds
    next()
})

//defining methods
userSchema.methods.isPasswordCorrect = async function(password){
    return  await bcrypt.compare(password, this.password)
}

//method to genrate access token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        }, 
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}

userSchema.methods.generateRefeshToken = function(){
    return jwt.sign(
        {
            id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}
export const User = new mongoose.model("User", userSchema);