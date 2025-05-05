import express , {Router} from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { runCode, submitCode } from "../controllers/execute.controllers.js"


const executeRouter = Router()

executeRouter.route("/run-code").post(authMiddleware,runCode)
executeRouter.route("/submit-code").post(authMiddleware,submitCode)



export default executeRouter