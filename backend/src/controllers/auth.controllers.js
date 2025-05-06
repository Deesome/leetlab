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

        const imageLocalFilePath = req.file?.path
        
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

const login = async (req,res) => {
    const {email,password} = req.body

    if(!email || !password){
        return res.status(400).json({
            success : false,
            message : "All the fields are required"
        })
    }

   try {
     const user = await db.user.findUnique({
         where : {
             email
         }
     })
 
     if(!user){
         return res.status(401).json({
             success : false,
             message : "User does not exist, Please signup first"
         })
     }
 
     const isMatch = await bcrypt.compare(password,user.password)
 
     if(!isMatch){
         return res.status(401).json({
             success : false,
             message : "Invalid Credentials"
         })
     }
 
     const token = jwt.sign(
         {id:user.id},
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
         message : "User Login Successfully",
         user : {
             id : user.id,
             name : user.name,
             email : user.email,
             role : user.role,
             image : user.image
         }
     })
   } catch (error) {

    console.error("error logging in user",error)
        res.status(500).json({
            error : "Error logging in user"
        })

    
   }

}

const logout = async (req,res) => {
    try {
        res.clearCookie("jwt",{
            httpOnly : true,
            sameSite : "strict",
            secure : process.env.NODE_ENV !== "development",
           })
    
           return res.status(200).json({
            successs : true,
            message : " User Logout Successfully"
           })
    } catch (error) {
        console.error("Error logging out user",error)
        res.status(500).json({
            message : "Error logging out the user"
        })

        
    }
}


const check = async(req,res)=>{
   try {
    return  res.status(200).json({
         success :  true,
         message : "User Chekced successfully",
         user : req.user
     })
   } catch (error) {
    return res.status(500).json({
        success : false,
        message : "Error in checking the user"
        
    })

    
   }
}



export {register,login,logout,check}