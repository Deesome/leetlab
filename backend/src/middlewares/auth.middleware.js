import jwt from "jsonwebtoken"
import { db } from "../libs/db.js"


const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        // console.log("token",token)

        if (!token) {
            return res.status(401).json({
                message: "unauthorized - no token provided"
            })
        }

        let decodedToken

        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            // console.log(decodedToken)
        } catch (error) {
            return res.status(401).json({
                message: "unauthorized - Invalid Token"
            })

        }

        const user = await db.user.findUnique({
            where: {
                id: decodedToken.id
            },
            select: {
                id: true,
                image: true,
                name: true,
                email: true,
                role: true
            }
        })

        if (!user) {
            return res.status(401).json({
                message: "user not found"
            })
        }
        // console.log("line 44",user)
        req.user = user
        next()
    } catch (error) {
        console.error("Error Authenticating User", error)
        res.status(500).json({
            message: "Error Authenticating User"
        })

    }
}

const checkAdmin = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          role: true,
        },
      });
  
      if (!user || user.role !== "ADMIN") {
        return res.status(403).json({
          message: "Access Denied- admins only",
        });
      }
  
      next();
    } catch (error) {
      res.status(500).json({
        message: "Error checking admin role",
      });
    }
  };


export {authMiddleware,checkAdmin}