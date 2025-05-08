import express from "express"
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js"
import { createProblem, deleteProblem, getAllProblems, getAllProblemSolvedByUser, getProblemById, updateProblemById } from "../controllers/problem.controllers.js"

const problemRouter = express.Router()

problemRouter.route("/create-problem").post(authMiddleware,checkAdmin,createProblem)
problemRouter.route("/all-problems").get(authMiddleware,getAllProblems)
problemRouter.route("/delete/:problemId").post(authMiddleware,checkAdmin,deleteProblem)
problemRouter.route("/update-problem/:problemId").post(authMiddleware,checkAdmin,updateProblemById)
problemRouter.route("/solved-problems").get(authMiddleware,getAllProblemSolvedByUser)
problemRouter.route("/:problemId").get(authMiddleware,getProblemById)




export default problemRouter