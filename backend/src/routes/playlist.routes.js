import {Router} from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { createPlayList } from "../controllers/playlist.controllers.js"

const playlistRouter = Router()

playlistRouter.route("/create-playlist").post(authMiddleware,createPlayList)


export default playlistRouter