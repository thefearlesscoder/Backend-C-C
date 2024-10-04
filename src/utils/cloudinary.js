import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // fs is the file system -> file management package in NODE
import path from "path";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })// link for the temporary file stored in our server.

        //filehas be uploaded succesfully
        console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath) //testing purpose
        return response
    } catch (error) {
        console.log("error while uploading on cloudinary", error);
        fs.unlinkSync(localFilePath) //remove the locallt saved temp file as the uplaod operation got failed
        return null;
    }
}


export {uploadOnCloudinary}
