import { Router } from "express";
import { login, register,logout, check } from "../controllers/auth.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const authRouter = Router()

authRouter.route("/register").post(upload.single("image"),register)
authRouter.route("/login").post(login)
authRouter.route("/logout").post(authMiddleware,logout)
authRouter.route("/check").get(authMiddleware,check)




export default authRouter