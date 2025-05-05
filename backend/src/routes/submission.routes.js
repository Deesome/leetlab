import express , {Router} from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { getAllSubmissions, getSubmissionCountForProblem, getSubmissionForProblem } from "../controllers/submission.controllers.js"

const submissionsRouter = Router()

submissionsRouter.route("/get-all-submissions").get(authMiddleware,getAllSubmissions)
submissionsRouter.route("/get-submissions-for-problem/:problemId").get(authMiddleware,getSubmissionForProblem)

submissionsRouter.route("/submission-count/:problemId").get(authMiddleware,getSubmissionCountForProblem)


export default submissionsRouter