import express from "express"
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js"
import { createProblem } from "../controllers/problem.controllers.js"

const problemRouter = express.Router()

problemRouter.route("/create-problem").post(authMiddleware,checkAdmin,createProblem)




export default problemRouter