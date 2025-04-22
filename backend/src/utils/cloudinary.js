import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"


dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDIANRY_API_SECRET
})

async function uploadOnCloudinary(path) {
    try {
        if (!path) return null
        const uploadResult = await cloudinary.uploader.upload(path, {
             resource_type: "auto" })

        //TODO - If file uplaod successfully on cloudinary then delete the file from server
        return uploadResult
    } catch (error) {
       return resizeBy.status(400).json({
        message : "Error Uplaoding on Cloudinary"
       })

        //TODO - If file uplaod fails on cloudinary then delete the file from server

    }
}


export default uploadOnCloudinary





