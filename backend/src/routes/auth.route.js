import { Router } from "express";
import { login, register } from "../controllers/auth.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const authRouter = Router()

authRouter.route("/register").post(upload.single("image"),register)
authRouter.route("/login").post(login)




export default authRouter