import bcrypt from "bcryptjs"
import { db } from "../libs/db.js"
import { userRole } from "../generated/prisma/index.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"


const register = async (req, res) => {

    const { name, email, password } = req.body
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: "Email and Password is required"
        })
    }

    try {
        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const imageLocalFilePath = req?.file.path
        const imageResponse = await uploadOnCloudinary(imageLocalFilePath)
      

        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: userRole.USER,
                image : imageResponse?.url
            }
        })

        const token = jwt.sign(
            {id:newUser.id},
            process.env.JWT_SECRET,
            {
                expiresIn : "7d"
            }
        )

        res.cookie("jwt",token,{
            httpOnly : true,
            sameSite : "strict",
            secure : process.env.NODE_ENV !== "development",
            maxAge : 7*24*60*60*1000
        })

        res.status(201).json({
            message : "User Created Successfully",
            user : {
                id : newUser.id,
                name : newUser.name,
                email : newUser.email,
                role : newUser.role,
                image : newUser.image
            }
        })
        

    } catch (error) {
        console.error("error creating user",error)
        res.status(500).json({
            error : "Error Creating user"
        })

    }



}




export {register}