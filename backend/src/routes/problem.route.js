import express from "express"
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js"
import { createProblem, getAllProblems, getProblemById } from "../controllers/problem.controllers.js"

const problemRouter = express.Router()

problemRouter.route("/create-problem").post(authMiddleware,checkAdmin,createProblem)
problemRouter.route("/all-problems").get(authMiddleware,getAllProblems)
problemRouter.route("/:problemId").get(authMiddleware,getProblemById)




export default problemRouter