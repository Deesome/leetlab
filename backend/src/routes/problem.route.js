import express from "express"
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js"
import { createProblem, deleteProblem, getAllProblems, getProblemById } from "../controllers/problem.controllers.js"

const problemRouter = express.Router()

problemRouter.route("/create-problem").post(authMiddleware,checkAdmin,createProblem)
problemRouter.route("/all-problems").get(authMiddleware,getAllProblems)
problemRouter.route("/:problemId").get(authMiddleware,getProblemById)
problemRouter.route("delete/:problemId").post(authMiddleware,checkAdmin,deleteProblem)




export default problemRouter