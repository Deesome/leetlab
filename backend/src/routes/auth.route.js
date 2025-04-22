import { Router } from "express";
import { register } from "../controllers/auth.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const authRouter = Router()

authRouter.route("/register").post(upload.single("image"),register)




export default authRouter