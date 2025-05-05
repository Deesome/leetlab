import express , {Router} from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { getAllSubmissions } from "../controllers/submission.controllers.js"

const submissionsRouter = Router()

submissionsRouter.route("/get-all-submissions").get(authMiddleware,getAllSubmissions)




export default submissionsRouter