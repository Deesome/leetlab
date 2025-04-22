import jwt from "jsonwebtoken"
import { db } from "../libs/db.js"


const authMiddleware = async(req,res,next) =>{

    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({
                message : "unauthorized - no token provided"
            })
        }

        let decodedToken

        try {
            decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        } catch (error) {
            return res.status(401).json({
                message : "unauthorized - Invalid Token"
            })
            
        }

        const user = db.user.findUnique({
            where : {
                id : decodedToken.id
            },
            select :{
                id : true,
                image : true,
                name : true,
                email : true,
                role : true
            }
        })

        if(!user){
            return res.status(401).json({
                message : "user not found"
            })
        }

        req.user = user
        next()
    } catch (error) {
        console.error("Error Authenticating User",error)
        res.status(500).json({
            message : "Error Authenticating User"
        })
        
    }
}


export default authMiddleware